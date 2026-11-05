import { displayValue } from '@/lib/form/display';
import type { Answers, FieldDef } from '@/lib/form/visibility';

interface ProfileAnswersProps {
  fields: readonly FieldDef[];
  answers: Answers;
  onChange: (key: string) => void;
}

// Read-only profile answers, each with a Change link.
function ProfileAnswers({ fields, answers, onChange }: ProfileAnswersProps) {
  if (fields.length === 0) return null;
  return (
    <section aria-labelledby="from-profile" className="panel px-4 pt-3 pb-1">
      <h2 id="from-profile" className="text-xs font-bold tracking-wide text-ink-muted uppercase">
        From your profile
      </h2>
      <dl className="divide-y divide-line">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-wrap items-center gap-x-4 gap-y-0.5 py-2.5">
            <dt className="w-full text-[13px] text-ink-muted">{field.label}</dt>
            <dd className="flex-1 font-bold">{displayValue(answers[field.key])}</dd>
            <dd>
              <button
                type="button"
                onClick={() => onChange(field.key)}
                aria-label={`Change ${field.label}`}
                className="rounded-ui px-2 py-1 text-sm font-bold text-primary hover:underline"
              >
                Change
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export { ProfileAnswers };
