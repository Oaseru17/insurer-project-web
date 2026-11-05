'use client';

import { useEffect, useRef } from 'react';
import type { Schemas } from '@/lib/api';

interface IneligiblePanelProps {
  reasons: Schemas['Reason'][];
  showReasons: boolean;
}

function IneligiblePanel({ reasons, showReasons }: IneligiblePanelProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <section
      aria-labelledby="ineligible-heading"
      className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-5"
    >
      <h2
        id="ineligible-heading"
        ref={heading}
        tabIndex={-1}
        className="text-xl font-semibold text-amber-950 focus-visible:outline-none"
      >
        Harbor can’t quote you right now
      </h2>
      {showReasons ? (
        <ul className="list-disc space-y-1 pl-5 text-amber-950">
          {reasons.map((reason) => (
            <li key={reason.code}>{reason.message}</li>
          ))}
        </ul>
      ) : (
        <p className="text-amber-950">Your details don’t meet Harbor’s requirements.</p>
      )}
    </section>
  );
}

export { IneligiblePanel };
