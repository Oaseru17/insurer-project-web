function CheckingEligibility() {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-10 text-slate-700">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
      />
      Checking eligibility…
    </div>
  );
}

export { CheckingEligibility };
