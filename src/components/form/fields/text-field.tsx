import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

type TextLike = FieldOf<'text'> | FieldOf<'email'> | FieldOf<'tel'>;

const INPUT_TYPE = { text: 'text', email: 'email', tel: 'tel' } as const;

function autoComplete(field: TextLike): string | undefined {
  if (field.type === 'email') return 'email';
  if (field.type === 'tel') return 'tel';
  if (/postal|zip/i.test(field.key)) return 'postal-code';
  if (/name/i.test(field.key)) return 'name';
  return undefined;
}

function TextField({ field, value, onChange, hint, error }: FieldProps<TextLike>) {
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
        type={INPUT_TYPE[field.type]}
        inputMode={field.type === 'tel' ? 'tel' : undefined}
        autoComplete={autoComplete(field)}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        className="input"
      />
      <ErrorText id={ids.error} text={error} />
    </div>
  );
}

export { TextField };
