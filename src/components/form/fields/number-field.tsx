import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

function NumberField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'number'>>) {
  const ids = fieldIds(field.key);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={ids.input} optional={!field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={hint} />
      <ErrorText id={ids.error} text={error} />
      <input
        id={ids.input}
        name={field.key}
        type="number"
        inputMode="numeric"
        min={field.min}
        max={field.max}
        value={typeof value === 'number' ? value : ''}
        onChange={(event) =>
          onChange(event.target.value === '' ? undefined : Number(event.target.value))
        }
        required={field.required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        className="block w-full max-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 aria-invalid:border-red-600"
      />
    </div>
  );
}

export { NumberField };
