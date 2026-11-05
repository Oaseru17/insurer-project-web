import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

function NumberField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'number'>>) {
  const ids = fieldIds(field.key);
  return (
    <div>
      <Label htmlFor={ids.input} required={field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={hint} />
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
        className="input max-w-40"
      />
      <ErrorText id={ids.error} text={error} />
    </div>
  );
}

export { NumberField };
