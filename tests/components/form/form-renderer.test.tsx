import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { FormRenderer } from '@/components/form/form-renderer';
import type { Schemas } from '@/lib/api';
import { setAnswer } from '@/lib/form/visibility';
import harborForm from '../../fixtures/harbor-form.json';

const form = harborForm as Schemas['FormDefinition'];

function Harness({ initial = {} }: { initial?: Schemas['Answers'] }) {
  const [values, setValues] = useState<Schemas['Answers']>(initial);
  return (
    <FormRenderer
      fields={form.fields}
      values={values}
      onChange={(key, value) => setValues((current) => setAnswer(current, key, value))}
    />
  );
}

describe('FormRenderer', () => {
  it("renders Harbor's form from its JSON, showing dog breed only once Dog is ticked", () => {
    render(<Harness />);

    expect(screen.getByLabelText('Full legal name')).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth date/)).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile number')).toHaveAttribute('type', 'tel');
    expect(screen.getByRole('combobox', { name: 'Contents coverage amount (USD)' })).toHaveValue(
      '',
    );
    const sprinklers = screen.getByRole('group', { name: /sprinklers/ });
    expect(
      within(sprinklers)
        .getAllByRole('radio')
        .filter((radio) => (radio as HTMLInputElement).checked),
    ).toHaveLength(0);
    expect(screen.queryByLabelText('Dog breed')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Dog' }));

    expect(screen.getByLabelText('Dog breed')).toBeInTheDocument();
  });

  it('does not let None sit alongside another pet', () => {
    render(<Harness initial={{ pets: ['Dog'] }} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'None' }));
    expect(screen.getByRole('checkbox', { name: 'Dog' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'None' })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Cat' }));
    expect(screen.getByRole('checkbox', { name: 'None' })).not.toBeChecked();
  });
});
