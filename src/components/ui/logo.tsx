// Text wordmark for the insurer project, set in the app font.
function Logo({ className, variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) {
  const colour = variant === 'dark' ? 'text-ink' : 'text-white';
  return (
    <span
      className={`inline-flex items-center text-lg font-bold tracking-tight ${colour} ${className ?? ''}`}
    >
      insurer project
    </span>
  );
}

export { Logo };
