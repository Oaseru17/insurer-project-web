'use client';

import { useEffect, useRef } from 'react';
import type { Schemas } from '@/lib/api';

interface SubmittedViewProps {
  quote: Schemas['QuoteResponse'];
  showCarrierRequest: boolean;
}

// Success message, plus a small labelled box showing the payload for developers.
function SubmittedView({ quote, showCarrierRequest }: SubmittedViewProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <div className="space-y-5">
      <section
        aria-labelledby="submitted-heading"
        className="message-positive animate-enter items-center p-6"
      >
        <span className="flex size-14 shrink-0 animate-pop items-center justify-center rounded-full bg-positive text-white">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-7">
            <path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="24"
              className="animate-draw"
            />
          </svg>
        </span>
        <div className="space-y-1">
          <h2
            id="submitted-heading"
            ref={heading}
            tabIndex={-1}
            className="text-xl font-bold focus-visible:outline-none"
          >
            Quote request made
          </h2>
          <p>Harbor has everything it needs to quote your renters insurance.</p>
          <p className="flex flex-wrap items-center gap-2 pt-1 text-sm">
            <span className="rounded-ui bg-white px-2 py-0.5 font-bold shadow-[inset_0_0_0_1px_var(--color-positive-border)]">
              Ref {quote.quoteId.slice(0, 8)}
            </span>
            Practice exercise — nothing was actually sent.
          </p>
        </div>
      </section>

      {showCarrierRequest && (
        <section aria-labelledby="dev-payload" className="animate-enter panel overflow-hidden">
          <h3
            id="dev-payload"
            className="border-b border-line bg-canvas px-3 py-1.5 text-xs font-bold text-ink-muted"
          >
            Dev only — the request Harbor will receive
          </h3>
          <pre className="max-h-64 overflow-auto bg-[#1b1c1d] p-3 text-xs leading-relaxed text-white">
            {JSON.stringify(quote.request, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}

export { SubmittedView };
