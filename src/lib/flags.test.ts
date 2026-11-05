import { describe, expect, it } from '@jest/globals';
import { eligibilityMinDelayMs, FLAG_DEFAULTS, resolveFlags } from './flags';

describe('resolveFlags', () => {
  it('turns every flag on by default', () => {
    expect(resolveFlags()).toEqual(FLAG_DEFAULTS);
  });

  it('turns a flag off with a leading minus and ignores unknown names', () => {
    expect(resolveFlags('-eligibilityLoadingStep,unknownFlag')).toEqual({
      ...FLAG_DEFAULTS,
      eligibilityLoadingStep: false,
    });
  });
});

describe('eligibilityMinDelayMs', () => {
  it('waits the configured duration only when the loading step is on', () => {
    expect(eligibilityMinDelayMs(resolveFlags(), 1500)).toBe(1500);
    expect(eligibilityMinDelayMs(resolveFlags('-eligibilityLoadingStep'), 1500)).toBe(0);
  });
});
