import { describedBy, ErrorText, fieldIds, Hint } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

// Carrier JSON doesn't mark options as exclusive; "None" can't sit alongside a real answer.
const EXCLUSIVE_OPTION = 'None';

function MultiSelectField({
  field,
  value,
  onChange,
  hint,
  error,
}: FieldProps<FieldOf<'multiselect'>>) {
  const ids = fieldIds(field.key);
  const chosen = Array.isArray(value) ? value : [];
  const regular = field.options.filter((option) => option !== EXCLUSIVE_OPTION);
  const hasExclusive = field.options.includes(EXCLUSIVE_OPTION);

  const toggle = (option: string, checked: boolean) => {
    if (option === EXCLUSIVE_OPTION) return onChange(checked ? [EXCLUSIVE_OPTION] : []);
    const next = checked
      ? [...chosen.filter((item) => item !== EXCLUSIVE_OPTION), option]
      : chosen.filter((item) => item !== option);
    onChange(field.options.filter((item) => next.includes(item)));
  };

  const box = (option: string) => (
    <label key={option} className="flex min-h-11 items-center gap-3">
      <input
        type="checkbox"
        name={field.key}
        value={option}
        checked={chosen.includes(option)}
        onChange={(event) => toggle(option, event.target.checked)}
        className="size-5"
      />
      {option}
    </label>
  );

  return (
    <fieldset
      aria-describedby={describedBy(ids, hint, error)}
      aria-invalid={error ? true : undefined}
      className="space-y-1.5"
    >
      <legend className="font-medium text-slate-900">
        {field.label}
        {!field.required && <span className="font-normal text-slate-500"> (optional)</span>}
      </legend>
      <Hint id={ids.hint} text={hint} />
      <ErrorText id={ids.error} text={error} />
      <div>
        {regular.map(box)}
        {hasExclusive && (
          <>
            <p className="py-1 text-sm text-slate-500">or</p>
            {box(EXCLUSIVE_OPTION)}
          </>
        )}
      </div>
    </fieldset>
  );
}

export { MultiSelectField };
