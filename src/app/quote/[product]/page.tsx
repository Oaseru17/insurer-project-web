export default async function QuotePage({ params }: PageProps<'/quote/[product]'>) {
  const { product } = await params;
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Your {product} quote</h1>
      <p className="text-slate-600">The quote flow arrives with the next ticket.</p>
    </section>
  );
}
