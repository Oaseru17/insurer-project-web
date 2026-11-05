'use client';

import { useEffect, useRef } from 'react';
import type { Schemas } from '@/lib/api';
import { AlertIcon } from '../ui/icons';

interface IneligiblePanelProps {
  carrierName: string;
  reasons: Schemas['Reason'][];
  showReasons: boolean;
}

function IneligiblePanel({ carrierName, reasons, showReasons }: IneligiblePanelProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <section aria-labelledby="ineligible-heading" className="message-negative animate-enter">
      <AlertIcon className="size-9 shrink-0" />
      <div className="space-y-2">
        <h1
          id="ineligible-heading"
          ref={heading}
          tabIndex={-1}
          className="text-lg font-bold focus-visible:outline-none"
        >
          {carrierName} can’t quote you right now
        </h1>
        {showReasons ? (
          <ul className="list-disc space-y-1 pl-5">
            {reasons.map((reason) => (
              <li key={reason.code}>{reason.message}</li>
            ))}
          </ul>
        ) : (
          <p>Your details don’t meet {carrierName}’s requirements.</p>
        )}
      </div>
    </section>
  );
}

export { IneligiblePanel };
