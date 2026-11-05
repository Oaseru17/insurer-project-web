'use client';

import { useEffect, useState } from 'react';
import { api, type Schemas } from '@/lib/api';
import { localIsoDate } from '@/lib/dates';
import type { Flags } from '@/lib/flags';
import { CheckingEligibility } from './checking-eligibility';
import { IneligiblePanel } from './ineligible-panel';

type Phase =
  | { name: 'checking' }
  | { name: 'ineligible'; reasons: Schemas['Reason'][] }
  | { name: 'form' }
  | { name: 'error'; message: string };

interface QuoteFlowProps {
  carrierId: string;
  customerId: string;
  flags: Flags;
  minDelayMs: number;
  checkEligibility?: typeof api.checkEligibility;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function QuoteFlow({
  carrierId,
  customerId,
  flags,
  minDelayMs,
  checkEligibility = api.checkEligibility,
}: QuoteFlowProps) {
  const [phase, setPhase] = useState<Phase>({ name: 'checking' });

  useEffect(() => {
    let current = true;
    void (async () => {
      const [result] = await Promise.all([
        checkEligibility(carrierId, { customerId, asOf: localIsoDate() }),
        wait(minDelayMs),
      ]);
      if (!current) return;
      if (!result.ok) setPhase({ name: 'error', message: result.error.message });
      else if (result.data.status === 'ineligible')
        setPhase({ name: 'ineligible', reasons: result.data.reasons });
      else setPhase({ name: 'form' });
    })();
    return () => {
      current = false;
    };
  }, [carrierId, customerId, minDelayMs, checkEligibility]);

  switch (phase.name) {
    case 'checking':
      return flags.eligibilityLoadingStep ? <CheckingEligibility /> : null;
    case 'ineligible':
      return (
        <IneligiblePanel reasons={phase.reasons} showReasons={flags.showIneligibilityReasons} />
      );
    case 'error':
      return (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
          {phase.message}
        </p>
      );
    case 'form':
      return (
        <section aria-labelledby="details-heading" className="space-y-2">
          <h2 id="details-heading" className="text-xl font-semibold">
            Your details
          </h2>
          <p className="text-slate-600">The questions arrive with the next ticket.</p>
        </section>
      );
  }
}

export { QuoteFlow };
