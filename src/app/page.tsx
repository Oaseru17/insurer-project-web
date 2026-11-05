import { connection } from 'next/server';
import { ProductPicker } from '@/components/product-picker';
import { api } from '@/lib/api';
import { productsFrom } from '@/lib/products';

export default async function HomePage() {
  await connection();
  const carriers = await api.getCarriers();

  if (!carriers.ok) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
        We couldn’t load the available insurance right now. Please try again shortly.
      </p>
    );
  }

  return <ProductPicker products={productsFrom(carriers.data)} />;
}
