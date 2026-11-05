import type { Schemas } from './api';

type CarrierSummary = Schemas['CarrierSummary'];

interface Product {
  id: string;
  label: string;
  description: string;
  carrierIds: string[];
}

// Display copy only; which products exist comes from the carriers the backend returns.
const PRODUCT_COPY: Record<string, { label: string; description: string }> = {
  renters: {
    label: 'Renters insurance',
    description: 'Cover for your belongings in a home you rent.',
  },
};

function copyFor(id: string) {
  return (
    PRODUCT_COPY[id] ?? {
      label: `${id.charAt(0).toUpperCase()}${id.slice(1)} insurance`,
      description: '',
    }
  );
}

function productsFrom(carriers: readonly CarrierSummary[]): Product[] {
  const byProduct = new Map<string, string[]>();
  for (const carrier of carriers) {
    byProduct.set(carrier.product, [...(byProduct.get(carrier.product) ?? []), carrier.id]);
  }
  return [...byProduct].map(([id, carrierIds]) => ({ id, ...copyFor(id), carrierIds }));
}

export { type Product, productsFrom };
