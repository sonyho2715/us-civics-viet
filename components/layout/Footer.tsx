'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-gray-600 dark:text-slate-400 text-center md:text-left">
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
