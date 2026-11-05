import { connection } from 'next/server';
import { ProductPicker } from '@/components/product-picker';
import { CustomerMenuContainer } from '@/components/customer-menu-container';
import { GreyFrame } from '@/components/quote/grey-frame';
import { api } from '@/lib/api';
import { productsFrom } from '@/lib/products';
import { currentCustomerId, demoCustomers } from '@/lib/session';

export default async function HomePage() {
  await connection();
  const [carriers, customerId, customers] = await Promise.all([
    api.getCarriers(),
    currentCustomerId(),
    demoCustomers(),
  ]);

  return (
    <GreyFrame
      title="Get a quote"
      right={<CustomerMenuContainer customers={customers} currentId={customerId} />}
    >
      {carriers.ok ? (
        <ProductPicker products={productsFrom(carriers.data)} />
      ) : (
        <p role="alert" className="message-negative">
          We couldn’t load the available insurance right now. Please try again shortly.
        </p>
      )}
    </GreyFrame>
  );
}
