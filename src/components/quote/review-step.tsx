import { displayValue } from '@/lib/form/display';
import type { Answers, FieldDef } from '@/lib/form/visibility';
import type { Schemas } from '@/lib/api';

interface ReviewStepProps {
  sections: readonly Schemas['CarrierSection'][];
  visible: readonly FieldDef[];
  answers: Answers;
  onEdit: (stepIndex: number) => void;
}

function ReviewStep({ sections, visible, answers, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const fields = visible.filter((field) => section.fields.includes(field.key));
        return (
          <section key={section.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{section.title}</h3>
              <button
                type="button"
                onClick={() => onEdit(index)}
                aria-label={`Change ${section.title}`}
                className="text-sm text-blue-700 underline"
              >
                Change
              </button>
            </div>
            <dl className="mt-2 divide-y divide-slate-100">
              {fields.map((field) => (
                <div key={field.key} className="flex flex-wrap gap-x-4 py-2">
                  <dt className="w-full text-sm text-slate-600 sm:w-48">{field.label}</dt>
                  <dd className="flex-1 font-medium">{displayValue(answers[field.key])}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}

export { ReviewStep };
