'use client';

import { useRouter } from 'next/navigation';
import type { DemoCustomer } from '@/lib/demo-customers';
import { writeCustomerCookie } from '@/lib/demo-customers';
import { CustomerMenu } from './customer-menu';

// Switching customer sets the cookie and re-renders the server page for that customer.
function CustomerMenuContainer({
  customers,
  currentId,
}: {
  customers: DemoCustomer[];
  currentId: string;
}) {
  const router = useRouter();
  return (
    <CustomerMenu
      customers={customers}
      currentId={currentId}
      onSelect={(id) => {
        writeCustomerCookie(id);
        router.refresh();
      }}
    />
  );
}

export { CustomerMenuContainer };
