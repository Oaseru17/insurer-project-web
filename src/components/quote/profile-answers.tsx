import { displayValue } from '@/lib/form/display';
import type { Answers, FieldDef } from '@/lib/form/visibility';

interface ProfileAnswersProps {
  fields: readonly FieldDef[];
  answers: Answers;
  onChange: (key: string) => void;
}

function ProfileAnswers({ fields, answers, onChange }: ProfileAnswersProps) {
  if (fields.length === 0) return null;
  return (
    <section
      aria-labelledby="from-profile"
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <h3
        id="from-profile"
        className="text-sm font-semibold tracking-wide text-slate-500 uppercase"
      >
        From your profile
      </h3>
      <dl className="mt-2 divide-y divide-slate-100">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
            <dt className="w-full text-sm text-slate-600 sm:w-48">{field.label}</dt>
            <dd className="flex-1 font-medium">{displayValue(answers[field.key])}</dd>
            <dd>
              <button
                type="button"
                onClick={() => onChange(field.key)}
                aria-label={`Change ${field.label}`}
                className="text-sm text-blue-700 underline"
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
