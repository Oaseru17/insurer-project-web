'use client';

import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { FormRenderer } from '@/components/form/form-renderer';
import type { Schemas } from '@/lib/api';
import { isAnswered } from '@/lib/form/display';
import { type Answers, setAnswer, visibleFields } from '@/lib/form/visibility';
import { ArrowIcon } from '../ui/icons';
import { ErrorSummary } from './error-summary';
import { GreyFrame } from './grey-frame';
import { ProfileAnswers } from './profile-answers';
import { ReviewStep } from './review-step';
import type { QuoteServices } from './services';
import { SubmittedView } from './submitted-view';

interface QuoteWizardProps {
  carrierId: string;
  customerId: string;
  asOf: string;
  services: QuoteServices;
  onIneligible: (reasons: Schemas['Reason'][]) => void;
  showCarrierRequest?: boolean;
  title?: string;
  topRight?: ReactNode;
}

type Load =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; form: Schemas['FormDefinition']; prefill: Schemas['PrefillResponse'] };

// Placeholder lines while the questions load.
function QuestionsSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="placeholder-line h-10 w-full" />
      <div className="placeholder-line w-1/4" />
      <div className="placeholder-line h-5 w-2/5" />
      <div className="space-y-3 pt-2">
        <div className="placeholder-line w-full" />
        <div className="placeholder-line w-5/6" />
        <div className="placeholder-line w-2/3" />
      </div>
      <div className="placeholder-line h-10 w-full" />
    </div>
  );
}

function QuoteWizard(props: QuoteWizardProps) {
  const { carrierId, customerId, services } = props;
  const [load, setLoad] = useState<Load>({ status: 'loading' });

  useEffect(() => {
    let current = true;
    void Promise.all([
      services.getCarrierForm(carrierId),
      services.prefill(carrierId, customerId),
    ]).then(([form, prefill]) => {
      if (!current) return;
      if (!form.ok) setLoad({ status: 'error', message: form.error.message });
      else if (!prefill.ok) setLoad({ status: 'error', message: prefill.error.message });
      else setLoad({ status: 'ready', form: form.data, prefill: prefill.data });
    });
    return () => {
      current = false;
    };
  }, [carrierId, customerId, services]);

  const wrap = (content: ReactNode) => (
    <GreyFrame title={props.title ?? 'Get a quote'} backHref="/" right={props.topRight}>
      {content}
    </GreyFrame>
  );

  if (load.status === 'loading')
    return wrap(
      <div role="status" aria-label="Loading your questions">
        <QuestionsSkeleton />
      </div>,
    );
  if (load.status === 'error')
    return wrap(
      <p role="alert" className="message-negative">
        {load.message}
      </p>,
    );
  return <Steps {...props} form={load.form} prefill={load.prefill} />;
}

const PREFILLED = new Set(['profile', 'converted']);

function initialAnswers(prefill: Schemas['PrefillResponse']): Answers {
  return Object.fromEntries(
    prefill.resolutions.flatMap((resolution) =>
      resolution.value === undefined ? [] : [[resolution.key, resolution.value]],
    ),
  );
}

function Steps({
  carrierId,
  customerId,
  asOf,
  services,
  onIneligible,
  showCarrierRequest = true,
  title = 'Get a quote',
  topRight,
  form,
  prefill,
}: QuoteWizardProps & { form: Schemas['FormDefinition']; prefill: Schemas['PrefillResponse'] }) {
  const { sections } = prefill;
  const [answers, setAnswers] = useState<Answers>(() => initialAnswers(prefill));
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState<ReadonlySet<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState<Schemas['QuoteResponse'] | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const resolutions = useMemo(
    () => new Map(prefill.resolutions.map((resolution) => [resolution.key, resolution])),
    [prefill],
  );
  const hints = useMemo(
    () =>
      Object.fromEntries(
        prefill.resolutions.flatMap((resolution) =>
          resolution.hint ? [[resolution.key, resolution.hint]] : [],
        ),
      ),
    [prefill],
  );
  const visible = visibleFields(form.fields, answers);
  const isReview = step === sections.length;
  const section = sections[step];
  const stepFields = section ? visible.filter((field) => section.fields.includes(field.key)) : [];
  const fromProfile = stepFields.filter(
    (field) =>
      PREFILLED.has(resolutions.get(field.key)?.source ?? '') &&
      !editing.has(field.key) &&
      isAnswered(answers[field.key]),
  );
  const asked = stepFields.filter((field) => !fromProfile.includes(field));

  useEffect(() => heading.current?.focus(), [step]);

  const goTo = (index: number) => {
    setErrors({});
    setStep(index);
  };

  // Eligibility is checked before the questions and again on submit, not on every step.
  const next = () => {
    const missing = Object.fromEntries(
      asked
        .filter((field) => field.required && !isAnswered(answers[field.key]))
        .map((field) => [field.key, `${field.label} is required`]),
    );
    if (Object.keys(missing).length > 0) return setErrors(missing);
    goTo(step + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    const result = await services.createQuote(carrierId, { customerId, asOf, answers });
    setSubmitting(false);
    if (result.ok) return setQuote(result.data);
    if (result.status === 422) return onIneligible(result.error.reasons ?? []);
    const issues = Object.fromEntries(
      (result.error.issues ?? []).map((issue) => [issue.path, issue.message]),
    );
    const firstStep = sections.findIndex((candidate) =>
      candidate.fields.some((key) => key in issues),
    );
    if (firstStep >= 0) {
      setStep(firstStep);
      setEditing((current) => new Set([...current, ...Object.keys(issues)]));
      setErrors(issues);
    } else setErrors({ form: result.error.message });
  };

  const stepCount = sections.length + 1;
  return (
    <GreyFrame
      title={title}
      stepLabel={quote ? 'Done' : `${step + 1} of ${stepCount}`}
      progress={{ total: stepCount, current: quote ? stepCount - 1 : step }}
      onBack={!quote && step > 0 ? () => goTo(step - 1) : undefined}
      backHref="/"
      right={topRight}
    >
      {quote ? (
        <SubmittedView quote={quote} showCarrierRequest={showCarrierRequest} />
      ) : (
        <div key={step} className="animate-enter space-y-6">
          <div className="space-y-1">
            <h2
              ref={heading}
              tabIndex={-1}
              className="text-2xl font-bold tracking-[-0.02em] focus-visible:outline-none"
            >
              {isReview ? 'Review your answers' : section?.title}
            </h2>
            <p className="text-[15px] text-ink-muted">
              {isReview
                ? 'Check everything, then get your quote.'
                : 'Answer what we don’t already know.'}
            </p>
          </div>
          <ErrorSummary errors={errors} />
          {isReview ? (
            <ReviewStep sections={sections} visible={visible} answers={answers} onEdit={goTo} />
          ) : (
            <>
              <ProfileAnswers
                fields={fromProfile}
                answers={answers}
                onChange={(key) => setEditing((current) => new Set([...current, key]))}
              />
              <FormRenderer
                fields={asked}
                values={answers}
                onChange={(key, value) => setAnswers((current) => setAnswer(current, key, value))}
                hints={hints}
                errors={errors}
              />
            </>
          )}
          <button
            type="button"
            onClick={() => (isReview ? void submit() : next())}
            disabled={submitting}
            aria-busy={submitting || undefined}
            className="button-primary group w-full overflow-hidden pr-0"
          >
            {submitting ? (
              <span className="flex items-center gap-2 pr-8 sm:pr-10">
                <span className="loader size-4 text-white" aria-hidden="true" />
                Getting your quote…
              </span>
            ) : (
              <>
                <span className="flex-1 pl-12 text-center">
                  {isReview ? 'Get quote' : 'Continue'}
                </span>
                <span className="-my-3.5 flex items-center self-stretch bg-black/10 px-4">
                  <ArrowIcon className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </GreyFrame>
  );
}

export { QuoteWizard };
