'use client';

import { useEffect, useState } from 'react';
import type { Schemas } from '@/lib/api';
import { localIsoDate } from '@/lib/dates';
import type { Flags } from '@/lib/flags';
import type { ReactNode } from 'react';
import { CheckingEligibility } from './checking-eligibility';
import { GreyFrame } from './grey-frame';
import { IneligiblePanel } from './ineligible-panel';
import { QuoteWizard } from './quote-wizard';
import { defaultQuoteServices, type QuoteServices } from './services';

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
  services?: QuoteServices;
  title?: string;
  topRight?: ReactNode;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function QuoteFlow({
  carrierId,
  customerId,
  flags,
  minDelayMs,
  services = defaultQuoteServices,
  title = 'Get a quote',
  topRight,
}: QuoteFlowProps) {
  const [phase, setPhase] = useState<Phase>({ name: 'checking' });
  const [asOf] = useState(localIsoDate);

  useEffect(() => {
    let current = true;
    void (async () => {
      const [result] = await Promise.all([
        services.checkEligibility(carrierId, { customerId, asOf }),
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
  }, [carrierId, customerId, asOf, minDelayMs, services]);

  const frame = (content: ReactNode) => (
    <GreyFrame title={title} backHref="/" right={topRight}>
      {content}
    </GreyFrame>
  );

  switch (phase.name) {
    case 'checking':
      return flags.eligibilityLoadingStep ? frame(<CheckingEligibility />) : null;
    case 'ineligible':
      return frame(
        <IneligiblePanel reasons={phase.reasons} showReasons={flags.showIneligibilityReasons} />,
      );
    case 'error':
      return frame(
        <p role="alert" className="message-negative">
          {phase.message}
        </p>,
      );
    case 'form':
      return (
        <QuoteWizard
          carrierId={carrierId}
          customerId={customerId}
          asOf={asOf}
          services={services}
          onIneligible={(reasons) => setPhase({ name: 'ineligible', reasons })}
          showCarrierRequest={flags.showCarrierRequest}
          title={title}
          topRight={topRight}
        />
      );
  }
}

export { QuoteFlow };
