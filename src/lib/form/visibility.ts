import type { Schemas } from '@/lib/api';

type FieldDef = Schemas['FieldDef'];
type Answers = Schemas['Answers'];
type FieldValue = Schemas['FieldValue'];

function includesValue(value: FieldValue | undefined, expected: string | number): boolean {
  return Array.isArray(value) ? value.some((item) => item === expected) : value === expected;
}

// Display only, so a dependent question appears as soon as it applies. The backend
// re-applies the same rule before anything is sent to the carrier.
function visibleFields(fields: readonly FieldDef[], answers: Answers): FieldDef[] {
  const visible = new Set<string>();
  return fields.filter((field) => {
    const shown =
      !field.showIf ||
      (visible.has(field.showIf.field) &&
        includesValue(answers[field.showIf.field], field.showIf.includes));
    if (shown) visible.add(field.key);
    return shown;
  });
}

// A cleared field is removed rather than stored as undefined, so it counts as unanswered.
function setAnswer(answers: Answers, key: string, value: FieldValue | undefined): Answers {
  if (value !== undefined) return { ...answers, [key]: value };
  const rest = { ...answers };
  delete rest[key];
  return rest;
}

export { type FieldDef, type Answers, type FieldValue, setAnswer, visibleFields };
