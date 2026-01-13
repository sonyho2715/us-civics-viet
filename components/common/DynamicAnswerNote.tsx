'use client';

import { RefreshCw, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface DynamicAnswerNoteProps {
  className?: string;
  compact?: boolean;
}

export function DynamicAnswerNote({ className, compact = false }: DynamicAnswerNoteProps) {
  const t = useTranslations('common');

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs text-purple-700',
          className
        )}
      >
        <RefreshCw className="w-3 h-3" />
        {t('dynamicAnswer')}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'p-3 bg-purple-50 border border-purple-200 rounded-lg',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <RefreshCw className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-purple-800 font-medium">{t('dynamicAnswer')}</p>
          <a
            href="https://www.uscis.gov/citizenship/testupdates"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 hover:underline mt-1"
          >
            {t('verifyAnswer')}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
