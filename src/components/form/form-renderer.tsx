'use client';

import type { ReactNode } from 'react';
import { type Answers, type FieldDef, type FieldValue, visibleFields } from '@/lib/form/visibility';
import { BooleanField } from './fields/boolean-field';
import { MultiSelectField } from './fields/multiselect-field';
import { NumberField } from './fields/number-field';
import { SelectField } from './fields/select-field';
import { TextField } from './fields/text-field';

interface FormRendererProps {
  fields: readonly FieldDef[];
  values: Answers;
  onChange: (key: string, value: FieldValue | undefined) => void;
  hints?: Readonly<Record<string, string>>;
  errors?: Readonly<Record<string, string>>;
}

// Schema-driven: one component per field type; nothing here knows about a particular carrier.
function renderField(field: FieldDef, props: Omit<FormRendererProps, 'fields'>): ReactNode {
  const common = {
    value: props.values[field.key],
    onChange: (value: FieldValue | undefined) => props.onChange(field.key, value),
    hint: props.hints?.[field.key],
    error: props.errors?.[field.key],
  };
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'date':
      return <TextField field={field} {...common} />;
    case 'number':
      return <NumberField field={field} {...common} />;
    case 'select':
      return <SelectField field={field} {...common} />;
    case 'multiselect':
      return <MultiSelectField field={field} {...common} />;
    case 'boolean':
      return <BooleanField field={field} {...common} />;
  }
}

function FormRenderer({ fields, ...props }: FormRendererProps) {
  return (
    <div className="space-y-6">
      {visibleFields(fields, props.values).map((field) => (
        <div key={field.key}>{renderField(field, props)}</div>
      ))}
    </div>
  );
}

export { type FormRendererProps, FormRenderer };
