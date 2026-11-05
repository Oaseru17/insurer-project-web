import { ChoiceCards } from './choice-cards';
import type { FieldOf, FieldProps } from './types';

// Neither option starts selected, so "not answered" is possible and optional fields can be left out.
function BooleanField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'boolean'>>) {
  return (
    <ChoiceCards
      fieldKey={field.key}
      label={field.label}
      required={field.required}
      hint={hint}
      error={error}
      choices={[
        { label: 'Yes', selected: value === true, onSelect: () => onChange(true) },
        { label: 'No', selected: value === false, onSelect: () => onChange(false) },
      ]}
    />
  );
}

export { BooleanField };
