'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { DemoCustomer } from '@/lib/demo-customers';
import { CheckIcon } from './ui/icons';

interface CustomerMenuProps {
  customers: readonly DemoCustomer[];
  currentId: string;
  onSelect: (id: string) => void;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

// Demo "log in as" disclosure in the top bar; there is no password because there is no auth.
function CustomerMenu({ customers, currentId, onSelect }: CustomerMenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const current = customers.find((customer) => customer.id === currentId);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2.5 rounded-full bg-canvas py-1 pr-3 pl-1 text-[15px] font-medium text-ink transition hover:bg-[#ebebef]"
      >
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
        >
          {current ? initials(current.name) : '?'}
        </span>
        {current?.name ?? 'Choose a customer'}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={`size-4 transition ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute top-full right-0 z-30 mt-2 w-64 animate-enter rounded-ui border border-line bg-white p-1.5 shadow-[0_12px_32px_-8px_rgb(5_5_5/0.18)]"
        >
          <p className="px-3 pt-2 pb-1 text-xs text-ink-faint">
            Signed in as {current?.name ?? '—'}
          </p>
          {customers.map((customer) => {
            const active = customer.id === currentId;
            return (
              <button
                key={customer.id}
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => {
                  setOpen(false);
                  if (!active) onSelect(customer.id);
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[15px] text-ink hover:bg-canvas"
              >
                <span className="flex-1">Log in as {customer.name}</span>
                {active && <CheckIcon className="size-4 text-primary" />}
              </button>
            );
          })}
          <p className="mt-1 border-t border-line px-3 pt-2 pb-1.5 text-xs text-ink-faint">
            Demo only — no password
          </p>
        </div>
      )}
    </div>
  );
}

export { type CustomerMenuProps, CustomerMenu };
