import { api } from '@/lib/api';

// The calls the quote journey makes; passed in so tests can supply stubs.
type QuoteServices = Pick<
  typeof api,
  'checkEligibility' | 'prefill' | 'getCarrierForm' | 'createQuote'
>;

const defaultQuoteServices: QuoteServices = api;

export { type QuoteServices, defaultQuoteServices };
