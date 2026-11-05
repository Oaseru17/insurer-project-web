import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { QuoteFlow } from '@/components/quote/quote-flow';
import type { api } from '@/lib/api';
import { FLAG_DEFAULTS, type Flags } from '@/lib/flags';

type CheckEligibility = typeof api.checkEligibility;

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
      checkEligibility={checkEligibility}
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

    expect(await screen.findByRole('heading', { name: /your details/i })).toBeInTheDocument();
  });

  it('shows the eligibility check only when its flag is on', async () => {
    const eligible = answer({ ok: true, data: { status: 'eligible' } });

    renderFlow(eligible);
    expect(screen.getByRole('status')).toHaveTextContent('Checking eligibility');
    await screen.findByRole('heading', { name: /your details/i });

    renderFlow(eligible, { ...FLAG_DEFAULTS, eligibilityLoadingStep: false });
    expect(screen.queryAllByRole('status')).toHaveLength(0);
  });
});
