import { describedBy, ErrorText, fieldIds, Hint, Legend } from '../field-shell';

interface Choice {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

interface ChoiceCardsProps {
  fieldKey: string;
  label: string;
  required: boolean;
  choices: readonly Choice[];
  hint?: string | undefined;
  error?: string | undefined;
  onClear?: (() => void) | undefined;
}

// Option tiles backed by real radios, so keyboard and screen readers work.
function ChoiceCards({
  fieldKey,
  label,
  required,
  choices,
  hint,
  error,
  onClear,
}: ChoiceCardsProps) {
  const ids = fieldIds(fieldKey);
  return (
    <fieldset
      id={ids.input}
      role="radiogroup"
      aria-describedby={describedBy(ids, hint, error)}
      aria-invalid={error ? true : undefined}
    >
      <Legend required={required}>{label}</Legend>
      <Hint id={ids.hint} text={hint} />
      <div
        className={`grid gap-2 ${choices.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}
      >
        {choices.map((choice) => (
          <label key={choice.label}>
            <input
              type="radio"
              name={fieldKey}
              checked={choice.selected}
              onChange={choice.onSelect}
              className="peer sr-only"
            />
            <span
              className={`flex min-h-[50px] cursor-pointer items-center justify-center rounded-ui border px-3 text-center text-[15px] font-medium transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                choice.selected
                  ? 'border-primary bg-soft text-primary-text'
                  : error
                    ? 'border-negative bg-white text-ink'
                    : 'border-line bg-white text-ink hover:border-line-strong'
              }`}
            >
              {choice.label}
            </span>
          </label>
        ))}
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${label}`}
          className="mt-2 rounded-ui px-1 text-sm font-bold text-primary hover:underline"
        >
          Clear answer
        </button>
      )}
      <ErrorText id={ids.error} text={error} />
    </fieldset>
  );
}

export { type Choice, ChoiceCards };
