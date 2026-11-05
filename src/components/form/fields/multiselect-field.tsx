'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon } from '../../ui/icons';
import { describedBy, ErrorText, fieldIds, Hint } from '../field-shell';
import type { FieldOf, FieldProps } from './types';

// Carrier JSON doesn't mark options as exclusive; "None" can't sit alongside a real answer.
const EXCLUSIVE_OPTION = 'None';

// Multi-select dropdown: chips in the field, a checkbox list in the popup.
function MultiSelectField({
  field,
  value,
  onChange,
  hint,
  error,
}: FieldProps<FieldOf<'multiselect'>>) {
  const ids = fieldIds(field.key);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const chosen = Array.isArray(value) ? value : [];
  const ordered = [
    ...field.options.filter((option) => option !== EXCLUSIVE_OPTION),
    ...field.options.filter((option) => option === EXCLUSIVE_OPTION),
  ];

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const toggle = (option: string, checked: boolean) => {
    if (option === EXCLUSIVE_OPTION) return onChange(checked ? [EXCLUSIVE_OPTION] : []);
    const next = checked
      ? [...chosen.filter((item) => item !== EXCLUSIVE_OPTION), option]
      : chosen.filter((item) => item !== option);
    onChange(field.options.filter((item) => next.includes(item)));
  };

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !open) return;
        setOpen(false);
        trigger.current?.focus();
      }}
      onBlur={(event) => {
        // Tabbing out closes the list; a mouse click outside is handled by the listener above.
        const next = event.relatedTarget;
        if (next instanceof Node && !root.current?.contains(next)) setOpen(false);
      }}
    >
      <p id={ids.label} className="field-label">
        {field.label}
        {!field.required && <span className="text-ink-faint"> (optional)</span>}
      </p>
      <Hint id={ids.hint} text={hint} />
      <button
        ref={trigger}
        id={ids.input}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-labelledby={`${ids.label} ${ids.input}`}
        aria-describedby={describedBy(ids, hint, error)}
        onClick={() => setOpen((current) => !current)}
        className={`select flex items-center gap-1.5 text-left ${error ? 'border-negative' : ''}`}
      >
        {chosen.length === 0 ? (
          <span className="text-[#9b9ba6]">Choose all that apply</span>
        ) : (
          chosen.map((option) => (
            <span
              key={option}
              className="rounded-full bg-soft px-2.5 py-0.5 text-sm font-medium text-primary-text"
            >
              {option}
            </span>
          ))
        )}
      </button>
      {open && (
        <div
          role="group"
          aria-labelledby={ids.label}
          className="absolute inset-x-0 top-full z-20 mt-1.5 animate-enter rounded-ui border border-line bg-white p-1.5 shadow-[0_12px_32px_-8px_rgb(5_5_5/0.18)]"
        >
          {ordered.map((option) => {
            const checked = chosen.includes(option);
            return (
              <label
                key={option}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-[15px] text-ink hover:bg-canvas ${
                  option === EXCLUSIVE_OPTION ? 'mt-1 border-t border-line pt-1' : ''
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={checked}
                  onChange={(event) => toggle(option, event.target.checked)}
                  className="peer sr-only"
                />
                <span className="flex size-[18px] items-center justify-center rounded border border-line-strong bg-white text-white transition peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                  {checked && <CheckIcon className="size-3.5" />}
                </span>
                {option}
              </label>
            );
          })}
        </div>
      )}
      <ErrorText id={ids.error} text={error} />
    </div>
  );
}

export { MultiSelectField };
