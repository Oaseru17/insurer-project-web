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
    const coverage = screen.getByRole('radiogroup', { name: 'Contents coverage amount (USD)' });
    expect(
      within(coverage)
        .getAllByRole('radio')
        .filter((radio) => (radio as HTMLInputElement).checked),
    ).toHaveLength(0);
    expect(within(coverage).getByRole('radio', { name: '$50,000' })).toBeInTheDocument();
    const sprinklers = screen.getByRole('radiogroup', { name: /sprinklers/ });
    expect(
      within(sprinklers)
        .getAllByRole('radio')
        .filter((radio) => (radio as HTMLInputElement).checked),
    ).toHaveLength(0);
    expect(screen.queryByRole('combobox', { name: 'Dog breed' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Pets in the home/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Dog' }));

    expect(screen.getByRole('combobox', { name: 'Dog breed' })).toBeInTheDocument();
  });

  it('fills in the date separators as the customer types', () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText(/Birth date/), { target: { value: '03121994' } });

    expect(screen.getByLabelText(/Birth date/)).toHaveValue('03/12/1994');
  });

  it('does not let None sit alongside another pet', () => {
    render(<Harness initial={{ pets: ['Dog'] }} />);
    fireEvent.click(screen.getByRole('button', { name: /Pets in the home/ }));

    fireEvent.click(screen.getByRole('checkbox', { name: 'None' }));
    expect(screen.getByRole('checkbox', { name: 'Dog' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'None' })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Cat' }));
    expect(screen.getByRole('checkbox', { name: 'None' })).not.toBeChecked();
  });
});
