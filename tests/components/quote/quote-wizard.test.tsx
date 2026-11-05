import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuoteWizard } from '@/components/quote/quote-wizard';
import type { QuoteServices } from '@/components/quote/services';
import type { Schemas } from '@/lib/api';
import harborForm from '../../fixtures/harbor-form.json';
import mayaPrefill from '../../fixtures/maya-prefill.json';

const SAM_LIKE_REASON = { code: 'min_age', field: 'date_of_birth', message: 'Too young' };

function stubServices(overrides: Partial<QuoteServices> = {}): QuoteServices {
  return {
    prefill: async () => ({ ok: true, data: mayaPrefill as Schemas['PrefillResponse'] }),
    getCarrierForm: async () => ({ ok: true, data: harborForm as Schemas['FormDefinition'] }),
    checkEligibility: async () => ({ ok: true, data: { status: 'eligible' } }),
    createQuote: async (carrierId, body) => ({
      ok: true,
      data: { quoteId: 'q-1', carrierId, request: body.answers, sent: false },
    }),
    ...overrides,
  };
}

function renderWizard(services: QuoteServices, onIneligible = jest.fn()) {
  render(
    <QuoteWizard
      carrierId="harbor"
      customerId="a"
      asOf="2026-11-05"
      services={services}
      onIneligible={onIneligible}
    />,
  );
  return onIneligible;
}

const next = () => fireEvent.click(screen.getByRole('button', { name: 'Next' }));
const type = (label: string | RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('QuoteWizard', () => {
  it('shows step 1 with what the profile answers, and asks only what is missing', async () => {
    renderWizard(stubServices());

    expect(await screen.findByText('Step 1 of 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'About you' })).toBeInTheDocument();
    expect(screen.getByText('Maya Torres')).toBeInTheDocument();
    expect(screen.queryByLabelText('Full legal name')).not.toBeInTheDocument();

    next();
    expect(screen.getByRole('alert')).toHaveTextContent('Mobile number is required');
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();

    type('Mobile number', '503-555-0142');
    next();
    expect(await screen.findByText('Step 2 of 5')).toBeInTheDocument();
  });

  it('walks the steps to review and shows the request Harbor would receive', async () => {
    renderWizard(stubServices());
    await screen.findByText('Step 1 of 5');

    type('Mobile number', '503-555-0142');
    next();
    await screen.findByText('Step 2 of 5');
    next();
    await screen.findByText('Step 3 of 5');
    type('Contents coverage amount (USD)', '2');
    next();
    await screen.findByText('Step 4 of 5');
    expect(screen.getByRole('checkbox', { name: 'Dog' })).toBeChecked();
    next();
    await screen.findByText('Step 5 of 5');
    type('Number of claims in the past 5 years', '0');
    next();

    expect(await screen.findByRole('heading', { name: 'Review your answers' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get quote' }));

    expect(await screen.findByText(/not sent/i)).toBeInTheDocument();
    expect(screen.getByText(/"contents_coverage": 50000/)).toBeInTheDocument();
  });

  it('re-checks eligibility when a step changes the birth date', async () => {
    const checkEligibility = jest.fn<QuoteServices['checkEligibility']>(async () => ({
      ok: true,
      data: { status: 'ineligible', reasons: [SAM_LIKE_REASON] },
    }));
    const onIneligible = renderWizard(stubServices({ checkEligibility }));
    await screen.findByText('Step 1 of 5');

    fireEvent.click(screen.getByRole('button', { name: 'Change Birth date' }));
    type(/Birth date/, '01/01/2010');
    type('Mobile number', '503-555-0142');
    next();

    await screen.findByText('Step 1 of 5');
    expect(checkEligibility).toHaveBeenCalledWith(
      'harbor',
      expect.objectContaining({
        answers: expect.objectContaining({ date_of_birth: '01/01/2010' }),
      }),
    );
    expect(onIneligible).toHaveBeenCalledWith([SAM_LIKE_REASON]);
  });
});
