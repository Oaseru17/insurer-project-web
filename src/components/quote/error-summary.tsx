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
      className="message-negative animate-enter block focus-visible:outline-none"
    >
      <p className="font-bold">Please check these answers</p>
      <ul className="mt-1 list-disc pl-5">
        {entries.map(([key, message]) => (
          <li key={key}>
            <a href={`#field-${key}`} className="underline underline-offset-2">
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { ErrorSummary };
