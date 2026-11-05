import type { ReactNode } from 'react';

interface FieldIds {
  input: string;
  hint: string;
  error: string;
}

function fieldIds(key: string): FieldIds {
  return { input: `field-${key}`, hint: `field-${key}-hint`, error: `field-${key}-error` };
}

function describedBy(ids: FieldIds, hint?: string, error?: string): string | undefined {
  return [hint ? ids.hint : null, error ? ids.error : null].filter(Boolean).join(' ') || undefined;
}

function Hint({ id, text }: { id: string; text?: string | undefined }) {
  return text ? (
    <p id={id} className="text-sm text-slate-600">
      {text}
    </p>
  ) : null;
}

function ErrorText({ id, text }: { id: string; text?: string | undefined }) {
  return text ? (
    <p id={id} className="text-sm font-medium text-red-700">
      <span className="sr-only">Error: </span>
      {text}
    </p>
  ) : null;
}

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block font-medium text-slate-900">
      {children}
      {optional && <span className="font-normal text-slate-500"> (optional)</span>}
    </label>
  );
}

export { type FieldIds, fieldIds, describedBy, Hint, ErrorText, Label };
