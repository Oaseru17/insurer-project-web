import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { ProfileSwitcher, toProfileId } from '@/components/quote/profile-switcher';
import { QuoteFlow } from '@/components/quote/quote-flow';
import { api } from '@/lib/api';
import { loadingStepMinDurationMs } from '@/lib/config';
import { eligibilityMinDelayMs, resolveFlags } from '@/lib/flags';
import { productsFrom } from '@/lib/products';

export default async function QuotePage({ params, searchParams }: PageProps<'/quote/[product]'>) {
  await connection();
  const [{ product }, query] = await Promise.all([params, searchParams]);
  const carriers = await api.getCarriers();
  if (!carriers.ok) throw new Error('Could not load carriers');

  const offered = productsFrom(carriers.data).find((candidate) => candidate.id === product);
  const carrierId = offered?.carrierIds[0];
  if (!offered || !carrierId) notFound();

  const profile = toProfileId(query.profile);
  const ff = typeof query.ff === 'string' ? query.ff : undefined;
  const flags = resolveFlags(query.ff);

  const carrierName = carriers.data.find((carrier) => carrier.id === carrierId)?.name ?? carrierId;

  return (
    <QuoteFlow
      key={profile}
      carrierId={carrierId}
      customerId={profile}
      flags={flags}
      minDelayMs={eligibilityMinDelayMs(flags, loadingStepMinDurationMs())}
      title={`${offered.label} · ${carrierName}`}
      topRight={<ProfileSwitcher product={product} active={profile} ff={ff} />}
    />
  );
}
