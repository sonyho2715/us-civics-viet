'use client';

import { useState, useMemo } from 'react';
import { Printer, X, Filter, Star, Bookmark } from 'lucide-react';
import { useQuestions } from '@/hooks/useQuestions';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { Button } from './Button';
import type { Category, Locale, Question } from '@/types';

interface PrintStudySheetProps {
  locale: Locale;
  onClose: () => void;
}

export function PrintStudySheet({ locale, onClose }: PrintStudySheetProps) {
  const { questions } = useQuestions();
  const { bookmarkedIds } = useBookmarkStore();
  const [filter, setFilter] = useState<'all' | 'bookmarked' | '65_20' | Category>('all');
  const [showAnswers, setShowAnswers] = useState(true);
  const [questionsPerPage, setQuestionsPerPage] = useState<10 | 20 | 50 | 'all'>('all');

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (filter === 'bookmarked') {
      filtered = questions.filter((q) => bookmarkedIds.includes(q.question_number));
    } else if (filter === '65_20') {
      filtered = questions.filter((q) => q.is_65_20);
    } else if (filter !== 'all') {
      filtered = questions.filter((q) => q.category === filter);
    }

    if (questionsPerPage !== 'all') {
      filtered = filtered.slice(0, questionsPerPage);
    }

    return filtered;
  }, [questions, filter, bookmarkedIds, questionsPerPage]);

  const handlePrint = () => {
    window.print();
  };

  const filterOptions = [
    { value: 'all', label: locale === 'vi' ? 'Tất cả 128 câu' : 'All 128 Questions' },
    { value: 'bookmarked', label: locale === 'vi' ? 'Đã đánh dấu' : 'Bookmarked', icon: Bookmark },
    { value: '65_20', label: '65/20', icon: Star },
    { value: 'american_government', label: locale === 'vi' ? 'Chính phủ Mỹ' : 'American Government' },
    { value: 'american_history', label: locale === 'vi' ? 'Lịch sử Mỹ' : 'American History' },
    { value: 'symbols_holidays', label: locale === 'vi' ? 'Biểu tượng & Ngày lễ' : 'Symbols & Holidays' },
  ];

  return (
    <>
      {/* Print Controls - hidden when printing */}
      <div className="no-print fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {locale === 'vi' ? 'In Tài Liệu Học' : 'Print Study Sheet'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Filter Options */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as typeof filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    filter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {option.icon && <option.icon className="w-4 h-4" />}
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={showAnswers}
                  onChange={(e) => setShowAnswers(e.target.checked)}
                  className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                {locale === 'vi' ? 'Hiện đáp án' : 'Show Answers'}
              </label>

              <select
                value={questionsPerPage}
                onChange={(e) => setQuestionsPerPage(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as 10 | 20 | 50)}
                className="text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-3 py-1.5"
              >
                <option value="10">{locale === 'vi' ? '10 câu' : '10 questions'}</option>
                <option value="20">{locale === 'vi' ? '20 câu' : '20 questions'}</option>
                <option value="50">{locale === 'vi' ? '50 câu' : '50 questions'}</option>
                <option value="all">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
              </select>
            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400">
              {locale === 'vi'
                ? `${filteredQuestions.length} câu hỏi sẽ được in`
                : `${filteredQuestions.length} questions will be printed`}
            </p>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-slate-900">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 space-y-4 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">
                {locale === 'vi' ? 'Thi Quốc Tịch Mỹ 2025' : 'U.S. Citizenship Test 2025'}
              </h3>
              {filteredQuestions.slice(0, 5).map((question) => (
                <QuestionPrintItem
                  key={question.id}
                  question={question}
                  locale={locale}
                  showAnswers={showAnswers}
                />
              ))}
              {filteredQuestions.length > 5 && (
                <p className="text-center text-gray-400 dark:text-slate-500 text-sm italic">
                  ... {locale === 'vi' ? `và ${filteredQuestions.length - 5} câu khác` : `and ${filteredQuestions.length - 5} more questions`}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {locale === 'vi' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              {locale === 'vi' ? 'In ngay' : 'Print Now'}
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Content - only visible when printing */}
      <div className="hidden print:block print-content">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            {locale === 'vi' ? 'Thi Quốc Tịch Mỹ 2025' : 'U.S. Citizenship Test 2025'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {locale === 'vi'
              ? `${filteredQuestions.length} câu hỏi`
              : `${filteredQuestions.length} questions`}
          </p>
        </div>
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <QuestionPrintItem
              key={question.id}
              question={question}
              locale={locale}
              showAnswers={showAnswers}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function QuestionPrintItem({
  question,
  locale,
  showAnswers,
}: {
  question: Question;
  locale: Locale;
  showAnswers: boolean;
}) {
  return (
    <div className="py-3 border-b border-gray-200 dark:border-slate-700 print:border-gray-300">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg flex items-center justify-center text-sm font-bold print:bg-gray-100 print:text-gray-800">
          {question.question_number}
        </span>
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white print:text-black">
            {locale === 'vi' ? question.question_vi : question.question_en}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400 print:text-gray-600">
            {locale === 'vi' ? question.question_en : question.question_vi}
          </p>
          {question.is_65_20 && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full mt-1 print:bg-amber-50 print:text-amber-800">
              <Star className="w-3 h-3" />
              65/20
            </span>
          )}
          {showAnswers && (
            <div className="mt-2 pl-3 border-l-2 border-green-500">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 print:text-green-800">
                {locale === 'vi' ? 'Đáp án:' : 'Answer:'}
              </p>
              <ul className="text-sm text-gray-700 dark:text-slate-300 print:text-gray-700">
                {(locale === 'vi' ? question.answers_vi : question.answers_en).map(
                  (answer, idx) => (
                    <li key={idx}>• {answer}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
