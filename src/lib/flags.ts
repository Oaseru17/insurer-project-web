const FLAG_DEFAULTS = {
  eligibilityLoadingStep: true,
  showIneligibilityReasons: true,
  showCarrierRequest: true,
} as const;

type FlagName = keyof typeof FLAG_DEFAULTS;
type Flags = Record<FlagName, boolean>;

function isFlagName(name: string): name is FlagName {
  return Object.hasOwn(FLAG_DEFAULTS, name);
}

// `?ff=-eligibilityLoadingStep,+showCarrierRequest` — a leading `-` turns a flag off, `+` or no
// prefix turns it on. Unknown names are ignored so a stale link never breaks the page.
function resolveFlags(ff?: string | string[]): Flags {
  const flags: Flags = { ...FLAG_DEFAULTS };
  const tokens = [ff ?? []].flat().flatMap((value) => value.split(','));
  for (const raw of tokens) {
    const token = raw.trim();
    const enabled = !token.startsWith('-');
    const name = token.replace(/^[+-]/, '');
    if (isFlagName(name)) flags[name] = enabled;
  }
  return flags;
}

function eligibilityMinDelayMs(flags: Flags, loadingStepMinDurationMs: number): number {
  return flags.eligibilityLoadingStep ? loadingStepMinDurationMs : 0;
}

export { type FlagName, type Flags, FLAG_DEFAULTS, resolveFlags, eligibilityMinDelayMs };
