import Link from 'next/link';
import type { ReactNode } from 'react';
import { BackIcon } from '../ui/icons';
import { Logo } from '../ui/logo';

interface GreyFrameProps {
  title: string;
  stepLabel?: string | undefined;
  progress?: { total: number; current: number } | undefined;
  onBack?: (() => void) | undefined;
  backHref?: string | undefined;
  right?: ReactNode;
  children: ReactNode;
}

// App frame (Grey onboarding style): full-width top bar with back, title and dashed progress;
// the content sits in a centred 400px column.
function GreyFrame({
  title,
  stepLabel,
  progress,
  onBack,
  backHref,
  right,
  children,
}: GreyFrameProps) {
  const back = (
    <span className="flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-canvas">
      <BackIcon className="size-5" />
    </span>
  );
  return (
    <div className="min-h-dvh p-2 sm:p-3">
      <div className="flex min-h-[calc(100dvh-1rem)] flex-col rounded-2xl bg-white sm:min-h-[calc(100dvh-1.5rem)]">
        <header className="grid grid-cols-1 items-center gap-3 border-b border-[#ececf0] px-3 py-3 sm:grid-cols-[1fr_auto_1fr] sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            {onBack ? (
              <button type="button" onClick={onBack} aria-label="Back">
                {back}
              </button>
            ) : backHref ? (
              <Link href={backHref} aria-label="Back">
                {back}
              </Link>
            ) : null}
            <Link href="/" aria-label="Home" className="shrink-0 rounded-ui px-1">
              <Logo className="h-6" />
            </Link>
            <p className="truncate pl-1 text-[15px] font-medium text-ink">
              {title}
              {stepLabel && <span className="text-ink-muted"> • {stepLabel}</span>}
            </p>
          </div>
          {progress && (
            <div className="flex justify-center" aria-hidden="true">
              <div className="flex gap-1.5">
                {Array.from({ length: progress.total }, (_, index) => (
                  <span
                    key={index}
                    className={`h-1 w-10 rounded-full transition-colors duration-500 sm:w-14 ${
                      index <= progress.current ? 'bg-primary' : 'bg-[#e6e6eb]'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          {right && (
            <div className="flex justify-center sm:col-start-3 sm:justify-end">{right}</div>
          )}
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <footer className="px-5 pb-4 text-center text-xs text-ink-faint">
          Practice exercise — quotes are never sent to a carrier.
        </footer>
      </div>
    </div>
  );
}

export { GreyFrame };
