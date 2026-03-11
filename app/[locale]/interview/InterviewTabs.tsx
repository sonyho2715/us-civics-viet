'use client';

import { useState } from 'react';
import { ClipboardList, MessageSquare } from 'lucide-react';
import { InterviewContent } from './InterviewContent';
import { N400YesNoContent } from './N400YesNoContent';
import type { Locale } from '@/types';

interface Props {
  locale: Locale;
}

type Tab = 'civics' | 'n400';

export function InterviewTabs({ locale }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('civics');
  const isVi = locale === 'vi';

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
        <div className="container mx-auto px-4 flex gap-1">
          <button
            onClick={() => setActiveTab('civics')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'civics'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {isVi ? 'Phỏng Vấn Công Dân' : 'Civics Interview'}
          </button>
          <button
            onClick={() => setActiveTab('n400')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'n400'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            {isVi ? 'N-400 Có/Không (32 câu)' : 'N-400 Yes/No (32 questions)'}
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'civics' ? (
        <InterviewContent locale={locale} />
      ) : (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isVi ? 'Câu Hỏi N-400 Có/Không' : 'N-400 Yes/No Questions'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isVi
                ? 'Luyện tập 32 câu hỏi Có/Không từ Phần 10 của đơn N-400'
                : 'Practice the 32 Yes/No questions from Part 10 of the N-400 application'}
            </p>
          </div>
          <N400YesNoContent locale={locale} />
        </div>
      )}
    </div>
  );
}
