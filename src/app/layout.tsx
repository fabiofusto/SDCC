import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';
import './globals.css';
import {Navbar} from '@/components/navbar';
import { SessionProvider } from 'next-auth/react';
import {Footer} from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const recursive = Recursive({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CobraInsights',
  description: 'Sentiment Analysis application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <SessionProvider>
          <Navbar />
          <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
            <div className="flex-1 flex flex-col h-full">{children}</div>
          </main>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
