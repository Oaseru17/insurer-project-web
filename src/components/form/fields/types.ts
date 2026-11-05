import type { FieldDef, FieldValue } from '@/lib/form/visibility';

interface FieldProps<T extends FieldDef = FieldDef> {
  field: T;
  value: FieldValue | undefined;
  onChange: (value: FieldValue | undefined) => void;
  hint?: string | undefined;
  error?: string | undefined;
}

type FieldOf<K extends FieldDef['type']> = Extract<FieldDef, { type: K }>;

export type { FieldProps, FieldOf };
