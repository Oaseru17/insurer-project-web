import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { QuoteFlow } from '@/components/quote/quote-flow';
import type { QuoteServices } from '@/components/quote/services';
import type { Schemas } from '@/lib/api';
import { FLAG_DEFAULTS, type Flags } from '@/lib/flags';
import harborForm from '../../fixtures/harbor-form.json';
import mayaPrefill from '../../fixtures/maya-prefill.json';

type CheckEligibility = QuoteServices['checkEligibility'];

const SAM_REASONS = [
  {
    code: 'min_age',
    field: 'date_of_birth',
    message: 'Harbor requires applicants to be 21 or older; you are 20.',
  },
  {
    code: 'state_not_served',
    field: 'residence_state',
    message: "Harbor doesn't quote in Nevada.",
  },
];

const answer =
  (data: Awaited<ReturnType<CheckEligibility>> & { ok: true }): CheckEligibility =>
  async () =>
    data;

function renderFlow(checkEligibility: CheckEligibility, flags: Flags = FLAG_DEFAULTS) {
  render(
    <QuoteFlow
      carrierId="harbor"
      customerId="b"
      flags={flags}
      minDelayMs={0}
      services={{
        checkEligibility,
        prefill: async () => ({ ok: true, data: mayaPrefill as Schemas['PrefillResponse'] }),
        getCarrierForm: async () => ({ ok: true, data: harborForm as Schemas['FormDefinition'] }),
        createQuote: async () => ({
          ok: false,
          status: 500,
          error: { code: 'internal_error', message: 'unused' },
        }),
      }}
    />,
  );
}

describe('QuoteFlow', () => {
  it('shows every reason Harbor cannot quote, and no way to submit', async () => {
    renderFlow(answer({ ok: true, data: { status: 'ineligible', reasons: SAM_REASONS } }));

    expect(await screen.findByRole('heading', { name: /can’t quote you/i })).toHaveFocus();
    for (const reason of SAM_REASONS) expect(screen.getByText(reason.message)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit|get quote/i })).not.toBeInTheDocument();
  });

  it('moves an eligible customer on to the questions', async () => {
    renderFlow(answer({ ok: true, data: { status: 'eligible' } }));

    expect(await screen.findByText('Step 1 of 5')).toBeInTheDocument();
  });

  it('shows the eligibility check only when its flag is on', async () => {
    const eligible = answer({ ok: true, data: { status: 'eligible' } });

    renderFlow(eligible);
    expect(screen.getByRole('status')).toHaveTextContent('Checking eligibility');
    await screen.findByText('Step 1 of 5');

    renderFlow(eligible, { ...FLAG_DEFAULTS, eligibilityLoadingStep: false });
    expect(screen.queryAllByRole('status')).toHaveLength(0);
  });
});
