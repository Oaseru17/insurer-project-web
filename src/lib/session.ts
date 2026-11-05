import { cookies } from 'next/headers';
import { api } from './api';
import {
  CUSTOMER_COOKIE,
  DEMO_CUSTOMER_IDS,
  type DemoCustomer,
  toCustomerId,
} from './demo-customers';

async function currentCustomerId(): Promise<string> {
  return toCustomerId((await cookies()).get(CUSTOMER_COOKIE)?.value);
}

// Names come from the backend so the menu shows real profiles, not hard-coded labels.
async function demoCustomers(): Promise<DemoCustomer[]> {
  const results = await Promise.all(DEMO_CUSTOMER_IDS.map((id) => api.getCustomer(id)));
  return results.flatMap((result) =>
    result.ok
      ? [
          {
            id: result.data.id,
            name: `${result.data.first_name} ${result.data.last_name}`,
          },
        ]
      : [],
  );
}

export { currentCustomerId, demoCustomers };
