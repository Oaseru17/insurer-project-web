import type { ReactNode } from 'react';

interface FieldIds {
  input: string;
  label: string;
  hint: string;
  error: string;
}

function fieldIds(key: string): FieldIds {
  return {
    input: `field-${key}`,
    label: `field-${key}-label`,
    hint: `field-${key}-hint`,
    error: `field-${key}-error`,
  };
}

function describedBy(ids: FieldIds, hint?: string, error?: string): string | undefined {
  return [hint ? ids.hint : null, error ? ids.error : null].filter(Boolean).join(' ') || undefined;
}

function Hint({ id, text }: { id: string; text?: string | undefined }) {
  return text ? (
    <p id={id} className="mb-1.5 text-[13px] text-ink-muted">
      {text}
    </p>
  ) : null;
}

function ErrorText({ id, text }: { id: string; text?: string | undefined }) {
  return text ? (
    <p id={id} className="mt-1.5 animate-enter text-[13px] font-medium text-negative-text">
      <span className="sr-only">Error: </span>
      {text}
    </p>
  ) : null;
}

function Optional({ show }: { show: boolean }) {
  return show ? <span className="text-ink-faint"> (optional)</span> : null;
}

function Label({
  htmlFor,
  id,
  children,
  required,
}: {
  htmlFor: string;
  id?: string;
  children: ReactNode;
  required: boolean;
}) {
  return (
    <label htmlFor={htmlFor} id={id} className="field-label">
      {children}
      <Optional show={!required} />
    </label>
  );
}

function Legend({
  id,
  children,
  required,
}: {
  id?: string;
  children: ReactNode;
  required: boolean;
}) {
  return (
    <legend id={id} className="field-label">
      {children}
      <Optional show={!required} />
    </legend>
  );
}

export { type FieldIds, fieldIds, describedBy, Hint, ErrorText, Label, Legend };
