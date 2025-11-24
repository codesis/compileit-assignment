import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boka mötesrum',
  description: 'Boka mötesrum på vardagar mellan 08:00 och 17:00',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
