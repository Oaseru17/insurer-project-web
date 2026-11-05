import type { FieldValue } from './visibility';

function isAnswered(value: FieldValue | undefined): value is FieldValue {
  if (value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function displayValue(value: FieldValue | undefined): string {
  if (!isAnswered(value)) return 'Not answered';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString('en-US');
  return value;
}

export { isAnswered, displayValue };
