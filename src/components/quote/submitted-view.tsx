'use client';

import { useEffect, useRef } from 'react';
import type { Schemas } from '@/lib/api';

function SubmittedView({ quote }: { quote: Schemas['QuoteResponse'] }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <section aria-labelledby="submitted-heading" className="space-y-3">
      <h2
        id="submitted-heading"
        ref={heading}
        tabIndex={-1}
        className="text-xl font-semibold focus-visible:outline-none"
      >
        Your Harbor quote request
      </h2>
      <p className="text-slate-600">Not sent — this is exactly what Harbor would receive.</p>
      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
        {JSON.stringify(quote.request, null, 2)}
      </pre>
    </section>
  );
}

export { SubmittedView };
