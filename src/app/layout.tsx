import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { Navbar } from '@/presentation/components/layout/navbar';
import { Footer } from '@/presentation/components/layout/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Plant Selling Website',
  description: 'Fresh & Calming plants for your home',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        playfair.variable,
        "font-sans antialiased bg-surface text-text-primary scroll-smooth"
      )}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
