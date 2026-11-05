import { connection } from 'next/server';
import { ProductPicker } from '@/components/product-picker';
import { GreyFrame } from '@/components/quote/grey-frame';
import { api } from '@/lib/api';
import { productsFrom } from '@/lib/products';

export default async function HomePage() {
  await connection();
  const carriers = await api.getCarriers();

  return (
    <GreyFrame title="Get a quote">
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
