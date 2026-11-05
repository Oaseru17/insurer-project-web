import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { AppShell } from '@/components/app-shell';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Olli — Renters insurance quote',
  description: 'Get a renters insurance quote using the details you already gave us.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
