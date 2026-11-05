// The brief's two sample customers stand in for signed-in users. The cookie holds only the
// customer id — never profile data.
const DEMO_CUSTOMER_IDS = ['a', 'b'] as const;
const DEFAULT_CUSTOMER_ID = 'a';
const CUSTOMER_COOKIE = 'olli_customer';

interface DemoCustomer {
  id: string;
  name: string;
}

function toCustomerId(value: string | undefined): string {
  return DEMO_CUSTOMER_IDS.find((id) => id === value) ?? DEFAULT_CUSTOMER_ID;
}

function writeCustomerCookie(id: string): void {
  document.cookie = `${CUSTOMER_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export { type DemoCustomer, DEMO_CUSTOMER_IDS, CUSTOMER_COOKIE, toCustomerId, writeCustomerCookie };
