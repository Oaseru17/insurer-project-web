import { describedBy, ErrorText, fieldIds, Hint } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

// Yes/No radios with neither selected, so "not answered" is possible and optional fields can be left out.
function BooleanField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'boolean'>>) {
  const ids = fieldIds(field.key);
  const choice = (label: string, answer: boolean) => (
    <label className="flex min-h-11 items-center gap-3">
      <input
        type="radio"
        name={field.key}
        checked={value === answer}
        onChange={() => onChange(answer)}
        className="size-5"
      />
      {label}
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
      <div className="flex gap-6">
        {choice('Yes', true)}
        {choice('No', false)}
      </div>
    </fieldset>
  );
}

export { BooleanField };
