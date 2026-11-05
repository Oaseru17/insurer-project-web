const DEFAULT_LOADING_STEP_MIN_DURATION_MS = 1000;

// NEXT_PUBLIC_ values are inlined at build time, so a change needs a rebuild.
function loadingStepMinDurationMs(
  value = process.env.NEXT_PUBLIC_LOADING_STEP_MIN_DURATION_MS,
): number {
  if (value === undefined || value.trim() === '') return DEFAULT_LOADING_STEP_MIN_DURATION_MS;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : DEFAULT_LOADING_STEP_MIN_DURATION_MS;
}

export { DEFAULT_LOADING_STEP_MIN_DURATION_MS, loadingStepMinDurationMs };
