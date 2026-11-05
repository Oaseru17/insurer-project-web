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

// Dates are typed in the carrier's own format (e.g. MM/DD/YYYY); native date pickers are
// awkward for birth dates and would need converting back.
function TextField({ field, value, onChange, hint, error }: FieldProps<TextLike>) {
  const ids = fieldIds(field.key);
  const formatHint = field.type === 'date' ? `Format: ${field.format}` : undefined;
  const fullHint = [formatHint, hint].filter(Boolean).join('. ') || undefined;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={ids.input} optional={!field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={fullHint} />
      <ErrorText id={ids.error} text={error} />
      <input
        id={ids.input}
        name={field.key}
        type={INPUT_TYPE[field.type]}
        inputMode={field.type === 'date' ? 'numeric' : undefined}
        autoComplete={autoComplete(field)}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, fullHint, error)}
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 aria-invalid:border-red-600"
      />
    </div>
  );
}

export { TextField };
