import type { Schemas } from '@/lib/api';
import { displayValue } from '@/lib/form/display';
import type { Answers, FieldDef } from '@/lib/form/visibility';

interface ReviewStepProps {
  sections: readonly Schemas['CarrierSection'][];
  visible: readonly FieldDef[];
  answers: Answers;
  onEdit: (stepIndex: number) => void;
}

// One bordered table per section, with an Edit link back to its step.
function ReviewStep({ sections, visible, answers, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-5">
      {sections.map((section, index) => {
        const fields = visible.filter((field) => section.fields.includes(field.key));
        return (
          <section key={section.id} className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-2.5">
              <h3 className="font-bold">{section.title}</h3>
              <button
                type="button"
                onClick={() => onEdit(index)}
                aria-label={`Change ${section.title}`}
                className="button-basic min-h-8 px-3 py-1.5 text-sm"
              >
                Edit
              </button>
            </div>
            <dl className="divide-y divide-line">
              {fields.map((field) => (
                <div key={field.key} className="grid sm:grid-cols-[14rem_1fr]">
                  <dt className="bg-canvas px-4 pt-2.5 text-sm font-bold sm:py-2.5">
                    {field.label}
                  </dt>
                  <dd className="px-4 pb-2.5 sm:py-2.5">{displayValue(answers[field.key])}</dd>
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
