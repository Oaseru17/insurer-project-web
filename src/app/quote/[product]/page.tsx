import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { CustomerMenuContainer } from '@/components/customer-menu-container';
import { QuoteFlow } from '@/components/quote/quote-flow';
import { api } from '@/lib/api';
import { loadingStepMinDurationMs } from '@/lib/config';
import { eligibilityMinDelayMs, resolveFlags } from '@/lib/flags';
import { productsFrom } from '@/lib/products';
import { currentCustomerId, demoCustomers } from '@/lib/session';

export default async function QuotePage({ params, searchParams }: PageProps<'/quote/[product]'>) {
  await connection();
  const [{ product }, query] = await Promise.all([params, searchParams]);
  const carriers = await api.getCarriers();
  if (!carriers.ok) throw new Error('Could not load carriers');

  const offered = productsFrom(carriers.data).find((candidate) => candidate.id === product);
  const carrierId = offered?.carrierIds[0];
  if (!offered || !carrierId) notFound();

  const flags = resolveFlags(query.ff);
  const [customerId, customers] = await Promise.all([currentCustomerId(), demoCustomers()]);

  const carrierName = carriers.data.find((carrier) => carrier.id === carrierId)?.name ?? carrierId;

  return (
    <QuoteFlow
      key={customerId}
      carrierId={carrierId}
      customerId={customerId}
      flags={flags}
      minDelayMs={eligibilityMinDelayMs(flags, loadingStepMinDurationMs())}
      title={`${offered.label} · ${carrierName}`}
      topRight={<CustomerMenuContainer customers={customers} currentId={customerId} />}
    />
  );
}
