import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
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

function renderWizard(
  services: QuoteServices,
  onIneligible = jest.fn(),
  showCarrierRequest = true,
) {
  render(
    <QuoteWizard
      carrierId="harbor"
      carrierName="Harbor Assurance"
      customerId="a"
      asOf="2026-11-05"
      services={services}
      onIneligible={onIneligible}
      showCarrierRequest={showCarrierRequest}
    />,
  );
  return onIneligible;
}

const next = () => fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
const type = (label: string | RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('QuoteWizard', () => {
  it('shows step 1 with what the profile answers, and asks only what is missing', async () => {
    renderWizard(stubServices());

    expect(await screen.findByRole('heading', { name: 'About you' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'About you' })).toBeInTheDocument();
    expect(screen.getByText('Maya Torres')).toBeInTheDocument();
    expect(screen.queryByLabelText('Full legal name')).not.toBeInTheDocument();

    next();
    expect(screen.getByRole('alert')).toHaveTextContent('Mobile number is required');
    expect(screen.getByRole('heading', { name: 'About you' })).toBeInTheDocument();

    type('Mobile number', '503-555-0142');
    next();
    expect(await screen.findByRole('heading', { name: 'Your home' })).toBeInTheDocument();
  });

  async function walkToReview() {
    await screen.findByRole('heading', { name: 'About you' });
    type('Mobile number', '503-555-0142');
    next();
    await screen.findByRole('heading', { name: 'Your home' });
    next();
    await screen.findByRole('heading', { name: 'Coverage' });
    fireEvent.click(screen.getByRole('radio', { name: '$50,000' }));
    next();
    await screen.findByRole('heading', { name: 'Pets' });
    fireEvent.click(screen.getByRole('button', { name: /Pets in the home/ }));
    expect(screen.getByRole('checkbox', { name: 'Dog' })).toBeChecked();
    next();
    await screen.findByRole('heading', { name: 'Claims history' });
    type('Number of claims in the past 5 years', '0');
    next();
    await screen.findByRole('heading', { name: 'Review your answers' });
  }

  it('shows a loading state, then confirms the quote request with the dev-only payload', async () => {
    let resolveQuote: (value: Awaited<ReturnType<QuoteServices['createQuote']>>) => void = () => {};
    const createQuote = jest.fn<QuoteServices['createQuote']>(
      (carrierId, body) =>
        new Promise((resolve) => {
          resolveQuote = () =>
            resolve({
              ok: true,
              data: { quoteId: 'q-1', carrierId, request: body.answers, sent: false },
            });
        }),
    );
    renderWizard(stubServices({ createQuote }));
    await walkToReview();

    fireEvent.click(screen.getByRole('button', { name: 'Get quote' }));
    const busy = await screen.findByRole('button', { name: /Getting your quote/ });
    expect(busy).toBeDisabled();

    resolveQuote({
      ok: true,
      data: { quoteId: 'q-1', carrierId: 'harbor', request: {}, sent: false },
    });
    expect(await screen.findByRole('heading', { name: 'Quote request made' })).toBeInTheDocument();
    expect(screen.getByText(/Dev only/)).toBeInTheDocument();
    expect(screen.getByText(/"contents_coverage": 50000/)).toBeInTheDocument();
  });

  it('hides the dev-only payload when its flag is off', async () => {
    renderWizard(stubServices(), jest.fn(), false);
    await walkToReview();

    fireEvent.click(screen.getByRole('button', { name: 'Get quote' }));

    expect(await screen.findByRole('heading', { name: 'Quote request made' })).toBeInTheDocument();
    expect(screen.queryByText(/Dev only/)).not.toBeInTheDocument();
  });

  it('checks eligibility again only when the quote is submitted, not on every step', async () => {
    const checkEligibility = jest.fn<QuoteServices['checkEligibility']>();
    const createQuote = jest.fn<QuoteServices['createQuote']>(async () => ({
      ok: false,
      status: 422,
      error: {
        code: 'ineligible',
        message: 'The carrier cannot quote this customer',
        reasons: [SAM_LIKE_REASON],
      },
    }));
    const onIneligible = renderWizard(stubServices({ checkEligibility, createQuote }));
    await screen.findByRole('heading', { name: 'About you' });

    fireEvent.click(screen.getByRole('button', { name: 'Change Birth date' }));
    type(/Birth date/, '01/01/2010');
    type('Mobile number', '503-555-0142');
    next();
    await screen.findByRole('heading', { name: 'Your home' });
    next();
    await screen.findByRole('heading', { name: 'Coverage' });
    fireEvent.click(screen.getByRole('radio', { name: '$50,000' }));
    next();
    await screen.findByRole('heading', { name: 'Pets' });
    next();
    await screen.findByRole('heading', { name: 'Claims history' });
    type('Number of claims in the past 5 years', '0');
    next();
    await screen.findByRole('heading', { name: 'Review your answers' });
    expect(checkEligibility).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Get quote' }));

    await screen.findByRole('heading', { name: 'Review your answers' });
    expect(createQuote).toHaveBeenCalledWith(
      'harbor',
      expect.objectContaining({
        answers: expect.objectContaining({ date_of_birth: '01/01/2010' }),
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onIneligible).toHaveBeenCalledWith([SAM_LIKE_REASON]);
  });

  it('puts the cursor in a profile answer the customer chooses to change', async () => {
    renderWizard(stubServices());
    await screen.findByRole('heading', { level: 1, name: 'About you' });

    fireEvent.click(screen.getByRole('button', { name: 'Change Birth date' }));

    expect(screen.getByLabelText(/Birth date/)).toHaveFocus();
  });

  it('on a 400, returns to the step with the problem and focuses the error summary', async () => {
    const createQuote = jest
      .fn<QuoteServices['createQuote']>()
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        error: {
          code: 'invalid_request',
          message: 'Some answers are not valid',
          issues: [{ path: 'phone', message: 'Mobile number is not valid' }],
        },
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        error: { code: 'invalid_request', message: 'Something went wrong' },
      });
    renderWizard(stubServices({ createQuote }));
    await walkToReview();

    fireEvent.click(screen.getByRole('button', { name: 'Get quote' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'About you' })).toBeInTheDocument();
    const summary = screen.getByRole('alert');
    expect(summary).toHaveFocus();
    expect(
      within(summary).getByRole('link', { name: 'Mobile number is not valid' }),
    ).toHaveAttribute('href', '#field-phone');

    for (let step = 0; step < 5; step++) next();
    await screen.findByRole('heading', { name: 'Review your answers' });
    fireEvent.click(screen.getByRole('button', { name: 'Get quote' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('alert')).toHaveFocus();
    expect(within(screen.getByRole('alert')).queryByRole('link')).not.toBeInTheDocument();
  });
});
