import type { ReactNode } from 'react';

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center px-4 py-3 sm:px-6 sm:py-4">
          <span className="text-lg font-semibold tracking-tight">Olli</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
      <footer className="mx-auto w-full max-w-2xl px-4 py-6 text-sm text-slate-500 sm:px-6">
        Practice exercise — quotes are never sent to a carrier.
      </footer>
    </div>
  );
}

export { AppShell };
