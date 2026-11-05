// Dates are kept in the carrier's own format (e.g. MM/DD/YYYY) so what is sent matches its form.
// The calendar works with local Date objects; these convert between the two.
const PARTS = ['YYYY', 'MM', 'DD'] as const;

function parseCarrierDate(value: string, format: string): Date | undefined {
  if (value.length !== format.length) return undefined;
  const [year, month, day] = PARTS.map((part) => {
    const at = format.indexOf(part);
    return at < 0 ? NaN : Number(value.slice(at, at + part.length));
  }) as [number, number, number];
  const date = new Date(year, month - 1, day);
  const real =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return real ? date : undefined;
}

function formatCarrierDate(date: Date, format: string): string {
  const pad = (n: number, width: number) => String(n).padStart(width, '0');
  return format
    .replace('YYYY', pad(date.getFullYear(), 4))
    .replace('MM', pad(date.getMonth() + 1, 2))
    .replace('DD', pad(date.getDate(), 2));
}

// "12 March 1994": spelled out so day and month can't be mistaken for each other.
const LONG_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function longDate(date: Date): string {
  return LONG_DATE.format(date);
}

export { parseCarrierDate, formatCarrierDate, longDate };
