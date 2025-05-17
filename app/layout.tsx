import { UserProvider } from '@/contexts/user-context';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TriGo - Travel Together, Go Further',
  description: 'The modern transportation platform connecting passengers, riders, dispatchers, and administrators',
  keywords: 'transportation, ridesharing, mobility, travel platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={cn(inter.className, 'bg-gray-900 antialiased')}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}