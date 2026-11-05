import Link from 'next/link';
import type { Product } from '@/lib/products';

function ProductPicker({ products }: { products: readonly Product[] }) {
  return (
    <section aria-labelledby="product-picker-heading" className="space-y-6">
      <div className="space-y-2">
        <h1
          id="product-picker-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          What would you like to insure?
        </h1>
        <p className="text-slate-600">We’ll use the details you’ve already given us.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/quote/${product.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow"
            >
              <span className="block text-lg font-medium">{product.label}</span>
              {product.description && (
                <span className="mt-1 block text-sm text-slate-600">{product.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { ProductPicker };
