import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { locales } from '@/lib/i18n';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLinks } from '@/components/accessibility/SkipLinks';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PWAProvider } from '@/components/providers/PWAProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles = {
    vi: 'Công Dân Mỹ - Thi Quốc Tịch 2025',
    en: 'U.S. Citizenship - Civics Test 2025',
  };

  const descriptions = {
    vi: 'Ứng dụng học thi quốc tịch Mỹ với 128 câu hỏi song ngữ Việt-Anh',
    en: 'Study app for U.S. Citizenship test with 128 bilingual Vietnamese-English questions',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: titles[locale as keyof typeof titles] || titles.vi,
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
  };
}

export function generateViewport() {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#1e40af' },
      { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as 'vi' | 'en')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <PWAProvider>
              <SkipLinks />
              <Header />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </PWAProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
