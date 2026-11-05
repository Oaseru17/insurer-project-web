import Link from 'next/link';
import type { Product } from '@/lib/products';
import { ArrowIcon, HomeIcon } from './ui/icons';

function ProductPicker({ products }: { products: readonly Product[] }) {
  return (
    <section aria-labelledby="product-picker-heading" className="animate-enter space-y-6">
      <div className="space-y-1">
        <h1 id="product-picker-heading" className="text-2xl font-bold">
          What would you like to insure?
        </h1>
        <p className="text-[15px]">We’ll use the details you’ve already given us.</p>
      </div>
      <ul className="space-y-3">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/quote/${product.id}`}
              className="panel group flex items-center gap-4 p-4 transition hover:border-primary hover:bg-soft"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-soft text-primary">
                <HomeIcon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-ink">{product.label}</span>
                {product.description && (
                  <span className="block text-sm">{product.description}</span>
                )}
              </span>
              <ArrowIcon className="size-4 text-ink transition group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { ProductPicker };
