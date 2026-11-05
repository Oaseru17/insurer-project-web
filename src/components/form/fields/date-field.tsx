'use client';

import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { formatCarrierDate, longDate, parseCarrierDate } from '@/lib/form/date-format';
import { CalendarIcon } from '../../ui/icons';
import { describedBy, ErrorText, fieldIds, Hint, Label } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

const EARLIEST = new Date(1900, 0, 1);

// A field-styled button that opens a calendar; the answer is stored in the carrier's format.
function DateField({ field, value, onChange, hint, error }: FieldProps<FieldOf<'date'>>) {
  const ids = fieldIds(field.key);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = typeof value === 'string' ? parseCarrierDate(value, field.format) : undefined;
  const isBirthDate = /birth/i.test(field.key);
  const today = new Date();

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const closeAndReturn = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) closeAndReturn();
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && !root.current?.contains(next)) setOpen(false);
      }}
    >
      <Label htmlFor={ids.input} id={ids.label} required={field.required}>
        {field.label}
      </Label>
      <Hint id={ids.hint} text={hint} />
      <button
        ref={trigger}
        id={ids.input}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${ids.label} ${ids.input}`}
        aria-describedby={describedBy(ids, hint, error)}
        onClick={() => setOpen((current) => !current)}
        className={`input flex items-center justify-between gap-3 text-left ${error ? 'border-negative' : ''}`}
      >
        <span className={selected ? '' : 'text-[#9b9ba6]'}>
          {selected ? longDate(selected) : 'Choose a date'}
        </span>
        <CalendarIcon className="size-[18px] shrink-0 text-ink-muted" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={`Choose ${field.label.toLowerCase()}`}
          className="absolute left-0 top-full z-20 mt-1.5 animate-enter rounded-ui border border-line bg-white p-3 shadow-[0_12px_32px_-8px_rgb(5_5_5/0.18)]"
        >
          <DayPicker
            mode="single"
            captionLayout="dropdown"
            selected={selected}
            defaultMonth={selected ?? (isBirthDate ? new Date(today.getFullYear() - 30, 0) : today)}
            startMonth={EARLIEST}
            endMonth={isBirthDate ? today : new Date(today.getFullYear() + 5, 11)}
            disabled={isBirthDate ? { after: today } : undefined}
            onSelect={(date) => {
              if (!date) return;
              onChange(formatCarrierDate(date, field.format));
              closeAndReturn();
            }}
            autoFocus
          />
        </div>
      )}
      <ErrorText id={ids.error} text={error} />
    </div>
  );
}

export { DateField };
