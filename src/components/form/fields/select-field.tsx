import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import { ChoiceCards } from './choice-cards';
import type { FieldOf, FieldProps } from './types';

// A few amounts read best side by side; any list of names (state, breed) is a dropdown.
const MAX_AMOUNT_TILES = 5;

function display(option: string | number, fieldLabel: string): string {
  if (typeof option === 'string') return option;
  return /\bUSD\b/.test(fieldLabel)
    ? option.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })
    : option.toLocaleString('en-US');
}

function SelectField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'select'>>) {
  const numeric = field.options.every((option) => typeof option === 'number');
  if (numeric && field.options.length <= MAX_AMOUNT_TILES) {
    return (
      <ChoiceCards
        fieldKey={field.key}
        label={field.label}
        required={field.required}
        hint={hint}
        error={error}
        choices={field.options.map((option) => ({
          label: display(option, field.label),
          selected: option === value,
          onSelect: () => onChange(option),
        }))}
      />
    );
  }
  const ids = fieldIds(field.key);
  const selected = field.options.findIndex((option) => option === value);
  return (
    <div>
      <Label htmlFor={ids.input} required={field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={hint} />
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
        className={`select ${selected === -1 ? 'text-[#9b9ba6]' : ''}`}
      >
        <option value="">Select {field.label.toLowerCase()}</option>
        {field.options.map((option, index) => (
          <option key={String(option)} value={String(index)} className="text-ink">
            {display(option, field.label)}
          </option>
        ))}
      </select>
      <ErrorText id={ids.error} text={error} />
    </div>
  );
}

export { SelectField };
