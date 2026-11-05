'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FormRenderer } from '@/components/form/form-renderer';
import type { Schemas } from '@/lib/api';
import { isAnswered } from '@/lib/form/display';
import { type Answers, setAnswer, visibleFields } from '@/lib/form/visibility';
import { ErrorSummary } from './error-summary';
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
}

type Load =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; form: Schemas['FormDefinition']; prefill: Schemas['PrefillResponse'] };

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

  if (load.status === 'loading') return <p className="text-slate-600">Loading your questions…</p>;
  if (load.status === 'error')
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
        {load.message}
      </p>
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
  form,
  prefill,
}: QuoteWizardProps & { form: Schemas['FormDefinition']; prefill: Schemas['PrefillResponse'] }) {
  const { sections } = prefill;
  const [answers, setAnswers] = useState<Answers>(() => initialAnswers(prefill));
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState<ReadonlySet<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
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

  const next = async () => {
    const missing = Object.fromEntries(
      asked
        .filter((field) => field.required && !isAnswered(answers[field.key]))
        .map((field) => [field.key, `${field.label} is required`]),
    );
    if (Object.keys(missing).length > 0) return setErrors(missing);

    setBusy(true);
    const eligibility = await services.checkEligibility(carrierId, { customerId, asOf, answers });
    setBusy(false);
    if (eligibility.ok && eligibility.data.status === 'ineligible') {
      return onIneligible(eligibility.data.reasons);
    }
    goTo(step + 1);
  };

  const submit = async () => {
    setBusy(true);
    const result = await services.createQuote(carrierId, { customerId, asOf, answers });
    setBusy(false);
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

  if (quote) return <SubmittedView quote={quote} />;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-sm font-medium text-blue-700">
          {isReview ? 'Last step' : `Step ${step + 1} of ${sections.length}`}
        </p>
        <h2
          ref={heading}
          tabIndex={-1}
          className="text-xl font-semibold focus-visible:outline-none"
        >
          {isReview ? 'Review your answers' : section?.title}
        </h2>
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

      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => void (isReview ? submit() : next())}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-60"
        >
          {isReview ? 'Get quote' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export { QuoteWizard };
