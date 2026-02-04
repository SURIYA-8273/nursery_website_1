import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { LayoutWrapper } from '@/presentation/components/layout/layout-wrapper';
import { ThemeProvider } from '@/presentation/components/common/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Inner Loop Technologies',
  description: 'Fresh & Calming plants for your home',
};

import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { GetSettingsUseCase } from '@/domain/usecases/get-settings.usecase';
import { GetCatalogDataUseCase } from '@/domain/usecases/get-catalog-data.usecase';

// ... (imports)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsRepo = new SupabaseSettingsRepository();
  const getSettings = new GetSettingsUseCase(settingsRepo);
  const settings = await getSettings.execute();

  const plantRepo = new SupabasePlantRepository();
  const getCatalogData = new GetCatalogDataUseCase(plantRepo);
  const { featuredPlants, categories } = await getCatalogData.execute();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        playfair.variable,
        "font-sans antialiased bg-surface text-text-primary scroll-smooth"
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper
            settings={settings}
            featuredPlants={featuredPlants}
            categories={categories}
          >
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
