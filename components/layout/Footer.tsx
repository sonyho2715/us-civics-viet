'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const footerLinks = [
    { href: `/${locale}/about`, label: t('links.about') },
    { href: `/${locale}/contact`, label: t('links.contact') },
    { href: `/${locale}/privacy`, label: t('links.privacy') },
    { href: `/${locale}/terms`, label: t('links.terms') },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              {t('disclaimer')}
            </p>
            <a
              href="https://www.uscis.gov/citizenship/testupdates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-800 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
            >
              {t('official')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-sm text-gray-500 dark:text-slate-500">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
