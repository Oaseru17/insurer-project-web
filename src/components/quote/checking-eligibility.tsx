function CheckingEligibility({ carrierName }: { carrierName: string }) {
  return (
    <div role="status" aria-live="polite" className="message-info animate-enter items-center">
      <span className="loader size-8 shrink-0 text-info-text" aria-hidden="true" />
      <div>
        <h1 className="font-bold">Checking eligibility…</h1>
        <p>Making sure {carrierName} can quote you before we ask anything.</p>
      </div>
    </div>
  );
}

export { CheckingEligibility };
