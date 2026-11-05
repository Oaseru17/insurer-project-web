'use client';

import { useEffect, useRef } from 'react';

function ErrorSummary({ errors }: { errors: Readonly<Record<string, string>> }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => box.current?.focus(), [errors]);
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;
  return (
    <div
      ref={box}
      role="alert"
      tabIndex={-1}
      className="rounded-lg border border-red-300 bg-red-50 p-4 focus-visible:outline-none"
    >
      <p className="font-semibold text-red-800">Please check these answers</p>
      <ul className="mt-2 list-disc pl-5 text-red-800">
        {entries.map(([key, message]) => (
          <li key={key}>
            <a href={`#field-${key}`} className="underline">
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { ErrorSummary };
