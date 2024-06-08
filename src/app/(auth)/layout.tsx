import '../globals.css';
import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';

const recursive = Recursive({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CobraInsights',
  description: 'Sentiment Analysis application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="flex-1 flex items-center justify-center h-full ">{children}</div>
        </main>
      </body>
    </html>
  );
}
