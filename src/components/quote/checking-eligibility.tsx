function CheckingEligibility() {
  return (
    <div role="status" aria-live="polite" className="message-info animate-enter items-center">
      <span className="loader size-8 shrink-0 text-info-text" aria-hidden="true" />
      <div>
        <p className="font-bold">Checking eligibility…</p>
        <p>Making sure Harbor can quote you before we ask anything.</p>
      </div>
    </div>
  );
}

export { CheckingEligibility };
