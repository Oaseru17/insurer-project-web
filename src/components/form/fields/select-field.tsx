import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

const display = (option: string | number) =>
  typeof option === 'number' ? option.toLocaleString('en-US') : option;

// Option values are indexes, so numeric options (e.g. coverage amounts) come back as numbers.
function SelectField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'select'>>) {
  const ids = fieldIds(field.key);
  const selected = field.options.findIndex((option) => option === value);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={ids.input} optional={!field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={hint} />
      <ErrorText id={ids.error} text={error} />
      <select
        id={ids.input}
        name={field.key}
        value={selected === -1 ? '' : String(selected)}
        onChange={(event) =>
          onChange(
            event.target.value === '' ? undefined : field.options[Number(event.target.value)],
          )
        }
        required={field.required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 aria-invalid:border-red-600"
      >
        <option value="">Choose…</option>
        {field.options.map((option, index) => (
          <option key={String(option)} value={String(index)}>
            {display(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export { SelectField };
