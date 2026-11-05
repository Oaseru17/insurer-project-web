import { maskDate } from '@/lib/form/date-mask';
import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

type TextLike = FieldOf<'text'> | FieldOf<'email'> | FieldOf<'tel'> | FieldOf<'date'>;

const INPUT_TYPE = { text: 'text', email: 'email', tel: 'tel', date: 'text' } as const;

function autoComplete(field: TextLike): string | undefined {
  if (field.type === 'email') return 'email';
  if (field.type === 'tel') return 'tel';
  if (field.type === 'date' && /birth/i.test(field.key)) return 'bday';
  if (/postal|zip/i.test(field.key)) return 'postal-code';
  if (/name/i.test(field.key)) return 'name';
  return undefined;
}

// Dates are typed in the carrier's own format; separators are filled in as the customer types.
function TextField({ field, value, onChange, hint, error }: FieldProps<TextLike>) {
  const ids = fieldIds(field.key);
  const formatHint = field.type === 'date' ? `Format: ${field.format}` : undefined;
  const fullHint = [formatHint, hint].filter(Boolean).join('. ') || undefined;
  return (
    <div>
      <Label htmlFor={ids.input} required={field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={fullHint} />
      <input
        id={ids.input}
        name={field.key}
        type={INPUT_TYPE[field.type]}
        inputMode={field.type === 'date' ? 'numeric' : field.type === 'tel' ? 'tel' : undefined}
        placeholder={field.type === 'date' ? field.format : undefined}
        maxLength={field.type === 'date' ? field.format.length : undefined}
        autoComplete={autoComplete(field)}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) =>
          onChange(
            field.type === 'date' ? maskDate(event.target.value, field.format) : event.target.value,
          )
        }
        required={field.required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, fullHint, error)}
        className="input"
      />
      <ErrorText id={ids.error} text={error} />
    </div>
  );
}

export { TextField };
