'use client';

import { useState, useMemo } from 'react';
import { Printer, X, Star, Bookmark, FileText, CreditCard, Calendar, Download, AlertTriangle, BarChart3 } from 'lucide-react';
import { useQuestions } from '@/hooks/useQuestions';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useProgressStore } from '@/stores/progressStore';
import { useWrongAnswerStore } from '@/stores/wrongAnswerStore';
import { useDifficultyStore } from '@/stores/difficultyStore';
import { DifficultyBadge } from './DifficultyBadge';
import { Button } from './Button';
import { CATEGORIES } from '@/types';
import type { Category, Locale, Question } from '@/types';

type PrintMode = 'study-sheet' | 'flashcards' | 'study-plan';

interface PrintStudySheetProps {
  locale: Locale;
  onClose: () => void;
}

export function PrintStudySheet({ locale, onClose }: PrintStudySheetProps) {
  const { questions } = useQuestions();
  const { bookmarkedIds } = useBookmarkStore();
  const { questionsIncorrect, questionsCorrect } = useProgressStore();
  const { wrongAnswers } = useWrongAnswerStore();
  const difficultyStore = useDifficultyStore();
  const [filter, setFilter] = useState<'all' | 'bookmarked' | '65_20' | 'needs_review' | 'wrong_answers' | 'hard' | 'medium' | 'easy' | Category>('all');
  const [showAnswers, setShowAnswers] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [questionsPerPage, setQuestionsPerPage] = useState<10 | 20 | 50 | 'all'>('all');
  const [printMode, setPrintMode] = useState<PrintMode>('study-sheet');

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (filter === 'bookmarked') {
      filtered = questions.filter((q) => bookmarkedIds.includes(q.question_number));
    } else if (filter === '65_20') {
      filtered = questions.filter((q) => q.is_65_20);
    } else if (filter === 'needs_review') {
      filtered = questions.filter((q) =>
        questionsIncorrect.includes(q.question_number) ||
        !questionsCorrect.includes(q.question_number)
      );
    } else if (filter === 'wrong_answers') {
      const wrongNums = new Set(wrongAnswers.map((w) => w.questionNumber));
      filtered = questions.filter((q) => wrongNums.has(q.question_number));
      // Sort by wrong count (most wrong first)
      filtered.sort((a, b) => {
        const aWrong = wrongAnswers.find((w) => w.questionNumber === a.question_number)?.wrongCount ?? 0;
        const bWrong = wrongAnswers.find((w) => w.questionNumber === b.question_number)?.wrongCount ?? 0;
        return bWrong - aWrong;
      });
    } else if (filter === 'hard' || filter === 'medium' || filter === 'easy') {
      const allNums = questions.map((q) => q.question_number);
      const matchingNums = new Set(difficultyStore.getAllByDifficulty(filter, allNums));
      filtered = questions.filter((q) => matchingNums.has(q.question_number));
      // Sort hard first by difficulty score
      if (filter === 'hard') {
        filtered.sort((a, b) => difficultyStore.getDifficultyScore(b.question_number) - difficultyStore.getDifficultyScore(a.question_number));
      }
    } else if (filter !== 'all') {
      filtered = questions.filter((q) => q.category === filter);
    }

    if (questionsPerPage !== 'all') {
      filtered = filtered.slice(0, questionsPerPage);
    }

    return filtered;
  }, [questions, filter, bookmarkedIds, questionsPerPage, questionsIncorrect, questionsCorrect, wrongAnswers, difficultyStore]);

  const handlePrint = () => {
    window.print();
  };

  const wrongAnswerCount = wrongAnswers.length;

  const filterOptions = [
    { value: 'all', label: locale === 'vi' ? 'Tất cả 128 câu' : 'All 128 Questions' },
    { value: 'bookmarked', label: locale === 'vi' ? 'Đã đánh dấu' : 'Bookmarked', icon: Bookmark },
    { value: '65_20', label: '65/20', icon: Star },
    { value: 'needs_review', label: locale === 'vi' ? 'Cần ôn tập' : 'Needs Review', icon: Calendar },
    ...(wrongAnswerCount > 0 ? [{
      value: 'wrong_answers',
      label: locale === 'vi' ? `Câu sai (${wrongAnswerCount})` : `Wrong Answers (${wrongAnswerCount})`,
      icon: AlertTriangle,
    }] : []),
    { value: 'hard', label: locale === 'vi' ? 'Khó' : 'Hard', icon: BarChart3, color: 'text-red-600' },
    { value: 'medium', label: locale === 'vi' ? 'Trung bình' : 'Medium', icon: BarChart3, color: 'text-amber-600' },
    { value: 'easy', label: locale === 'vi' ? 'Dễ' : 'Easy', icon: BarChart3, color: 'text-green-600' },
    { value: 'american_government', label: locale === 'vi' ? 'Chính phủ Mỹ' : 'American Government' },
    { value: 'american_history', label: locale === 'vi' ? 'Lịch sử Mỹ' : 'American History' },
    { value: 'symbols_holidays', label: locale === 'vi' ? 'Biểu tượng & Ngày lễ' : 'Symbols & Holidays' },
  ];

  const printModeOptions = [
    {
      value: 'study-sheet' as PrintMode,
      label: locale === 'vi' ? 'Tài liệu học' : 'Study Sheet',
      description: locale === 'vi' ? 'Câu hỏi và đáp án dạng danh sách' : 'Questions and answers in list format',
      icon: FileText,
    },
    {
      value: 'flashcards' as PrintMode,
      label: locale === 'vi' ? 'Thẻ ghi nhớ' : 'Flashcards',
      description: locale === 'vi' ? 'In thẻ để cắt và học' : 'Print cards to cut and study',
      icon: CreditCard,
    },
    {
      value: 'study-plan' as PrintMode,
      label: locale === 'vi' ? 'Kế hoạch học' : 'Study Plan',
      description: locale === 'vi' ? 'Lịch học 4 tuần với checklist' : '4-week schedule with checklist',
      icon: Calendar,
    },
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
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Print Mode Selection */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {locale === 'vi' ? 'Chọn kiểu in:' : 'Select print format:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {printModeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPrintMode(option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    printMode === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <option.icon className={`w-4 h-4 ${printMode === option.value ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${printMode === option.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Options - only for study-sheet and flashcards modes */}
          {printMode !== 'study-plan' && (
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
                {printMode === 'study-sheet' && (
                  <>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <input
                        type="checkbox"
                        checked={showAnswers}
                        onChange={(e) => setShowAnswers(e.target.checked)}
                        className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      {locale === 'vi' ? 'Hiện đáp án' : 'Show Answers'}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <input
                        type="checkbox"
                        checked={showDifficulty}
                        onChange={(e) => setShowDifficulty(e.target.checked)}
                        className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      {locale === 'vi' ? 'Hiện độ khó' : 'Show Difficulty'}
                    </label>
                  </>
                )}

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

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {locale === 'vi'
                  ? `${filteredQuestions.length} câu hỏi sẽ được in`
                  : `${filteredQuestions.length} questions will be printed`}
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-slate-900">
            {/* Study Sheet Preview */}
            {printMode === 'study-sheet' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 space-y-4 max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">
                  {locale === 'vi' ? 'Thi Quốc Tịch Mỹ 2025' : 'U.S. Citizenship Test 2025'}
                </h3>
                {filter === 'wrong_answers' && filteredQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'vi' ? 'Chưa có câu trả lời sai. Hãy làm bài kiểm tra thử!' : 'No wrong answers yet. Take a practice test!'}
                    </p>
                  </div>
                )}
                {filteredQuestions.slice(0, 5).map((question) => (
                  <QuestionPrintItem
                    key={question.id}
                    question={question}
                    locale={locale}
                    showAnswers={showAnswers}
                    showDifficulty={showDifficulty}
                    difficulty={difficultyStore.getDifficulty(question.question_number)}
                    wrongCount={filter === 'wrong_answers' ? wrongAnswers.find((w) => w.questionNumber === question.question_number)?.wrongCount : undefined}
                  />
                ))}
                {filteredQuestions.length > 5 && (
                  <p className="text-center text-gray-400 dark:text-slate-500 text-sm italic">
                    ... {locale === 'vi' ? `và ${filteredQuestions.length - 5} câu khác` : `and ${filteredQuestions.length - 5} more questions`}
                  </p>
                )}
              </div>
            )}

            {/* Flashcards Preview */}
            {printMode === 'flashcards' && (
              <div className="max-w-4xl mx-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  {locale === 'vi'
                    ? 'Mỗi thẻ có câu hỏi ở mặt trước và đáp án ở mặt sau. Cắt theo đường kẻ.'
                    : 'Each card has the question on front, answer on back. Cut along the lines.'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {filteredQuestions.slice(0, 4).map((question) => (
                    <FlashcardPreview key={question.id} question={question} locale={locale} />
                  ))}
                </div>
                {filteredQuestions.length > 4 && (
                  <p className="text-center text-gray-400 dark:text-slate-500 text-sm italic mt-4">
                    ... {locale === 'vi' ? `và ${filteredQuestions.length - 4} thẻ khác` : `and ${filteredQuestions.length - 4} more cards`}
                  </p>
                )}
              </div>
            )}

            {/* Study Plan Preview */}
            {printMode === 'study-plan' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
                  {locale === 'vi' ? 'Kế Hoạch Học 4 Tuần' : '4-Week Study Plan'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                  {locale === 'vi'
                    ? 'Lịch học được tối ưu để chuẩn bị cho kỳ thi quốc tịch'
                    : 'Optimized schedule to prepare for the citizenship test'}
                </p>
                <StudyPlanPreview locale={locale} questions={questions} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                <Download className="w-3 h-3" />
                {locale === 'vi'
                  ? 'Mẹo: Chọn "Save as PDF" trong hộp thoại in để lưu dạng PDF'
                  : 'Tip: Select "Save as PDF" in the print dialog to save as PDF'}
              </p>
              <div className="flex gap-3">
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
        </div>
      </div>

      {/* Printable Content - only visible when printing */}
      <div className="hidden print:block print-content">
        {/* Study Sheet Print Layout */}
        {printMode === 'study-sheet' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">
                {locale === 'vi' ? 'Thi Quốc Tịch Mỹ 2025' : 'U.S. Citizenship Test 2025'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {locale === 'vi'
                  ? `${filteredQuestions.length} câu hỏi`
                  : `${filteredQuestions.length} questions`}
                {filter !== 'all' && ` — ${filterOptions.find((f) => f.value === filter)?.label ?? ''}`}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">congdan.us</p>
            </div>
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionPrintItem
                  key={question.id}
                  question={question}
                  locale={locale}
                  showAnswers={showAnswers}
                  showDifficulty={showDifficulty}
                  wrongCount={filter === 'wrong_answers' ? wrongAnswers.find((w) => w.questionNumber === question.question_number)?.wrongCount : undefined}
                />
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
              <p>congdan.us — {locale === 'vi' ? 'Ôn thi Quốc tịch Mỹ' : 'U.S. Citizenship Test Prep'}</p>
            </div>
          </>
        )}

        {/* Flashcards Print Layout */}
        {printMode === 'flashcards' && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">
                {locale === 'vi' ? 'Thẻ Ghi Nhớ - Thi Quốc Tịch Mỹ' : 'Flashcards - U.S. Citizenship Test'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {locale === 'vi' ? 'Cắt theo đường kẻ nét đứt' : 'Cut along dashed lines'}
              </p>
            </div>
            <FlashcardsPrintLayout questions={filteredQuestions} locale={locale} />
          </>
        )}

        {/* Study Plan Print Layout */}
        {printMode === 'study-plan' && (
          <StudyPlanPrintLayout questions={questions} locale={locale} />
        )}
      </div>
    </>
  );
}

function QuestionPrintItem({
  question,
  locale,
  showAnswers,
  showDifficulty = false,
  difficulty,
  wrongCount,
}: {
  question: Question;
  locale: Locale;
  showAnswers: boolean;
  showDifficulty?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard' | 'unrated';
  wrongCount?: number;
}) {
  return (
    <div className="py-3 border-b border-gray-200 dark:border-slate-700 print:border-gray-300 print:break-inside-avoid">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg flex items-center justify-center text-sm font-bold print:bg-gray-100 print:text-gray-800">
          {question.question_number}
        </span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-gray-900 dark:text-white print:text-black">
              {locale === 'vi' ? question.question_vi : question.question_en}
            </p>
            {showDifficulty && difficulty && (
              <div className="flex-shrink-0">
                <DifficultyBadge difficulty={difficulty} locale={locale} />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">
            {locale === 'vi' ? question.question_en : question.question_vi}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {question.is_65_20 && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full print:bg-amber-50 print:text-amber-800">
                <Star className="w-3 h-3" />
                65/20
              </span>
            )}
            {wrongCount !== undefined && wrongCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full print:bg-red-50 print:text-red-800">
                <AlertTriangle className="w-3 h-3" />
                {locale === 'vi' ? `Sai ${wrongCount} lần` : `Wrong ${wrongCount}x`}
              </span>
            )}
          </div>
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

// Flashcard Preview Component (for the modal)
function FlashcardPreview({ question, locale }: { question: Question; locale: Locale }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 p-4">
      <div className="text-center">
        <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded mb-2">
          #{question.question_number}
        </span>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {locale === 'vi' ? question.question_vi : question.question_en}
        </p>
        <div className="mt-3 pt-3 border-t border-dashed border-gray-300 dark:border-slate-600">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
            {(locale === 'vi' ? question.answers_vi : question.answers_en)[0]}
          </p>
        </div>
      </div>
    </div>
  );
}

// Flashcards Print Layout - 2-column fold-in-half design with page breaks every 8 cards
function FlashcardsPrintLayout({ questions, locale }: { questions: Question[]; locale: Locale }) {
  // Group questions into pages of 8 (4 rows x 2 columns)
  const cardsPerPage = 8;
  const pages: Question[][] = [];
  for (let i = 0; i < questions.length; i += cardsPerPage) {
    pages.push(questions.slice(i, i + cardsPerPage));
  }

  return (
    <div>
      {pages.map((pageQuestions, pageIdx) => (
        <div key={pageIdx} className={pageIdx > 0 ? 'break-before-page' : ''}>
          {/* Front sides (Questions) */}
          <div className="grid grid-cols-2 gap-0">
            {pageQuestions.map((question) => (
              <div
                key={`front-${question.id}`}
                className="border border-dashed border-gray-400 p-4 h-48 flex flex-col items-center justify-center text-center"
              >
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded mb-2">
                  #{question.question_number}
                  {question.is_65_20 && ' ★'}
                </span>
                <p className="text-sm font-medium text-black leading-snug">
                  {locale === 'vi' ? question.question_vi : question.question_en}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {locale === 'vi' ? question.question_en : question.question_vi}
                </p>
              </div>
            ))}
          </div>

          {/* Page break between front and back */}
          <div className="break-before-page" />

          {/* Back sides (Answers) - columns swapped for fold-in-half */}
          <div className="grid grid-cols-2 gap-0">
            {pageQuestions.map((question, idx) => {
              // Swap columns within each row for correct fold alignment
              const rowIdx = Math.floor(idx / 2);
              const colIdx = idx % 2;
              const swappedIdx = rowIdx * 2 + (1 - colIdx);
              const displayQuestion = pageQuestions[swappedIdx] || question;

              return (
                <div
                  key={`back-${displayQuestion.id}`}
                  className="border border-dashed border-gray-400 p-4 h-48 flex flex-col items-center justify-center text-center bg-green-50"
                >
                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded mb-2">
                    {locale === 'vi' ? 'Đáp án' : 'Answer'} #{displayQuestion.question_number}
                  </span>
                  <ul className="text-sm text-green-800 space-y-1">
                    {(locale === 'vi' ? displayQuestion.answers_vi : displayQuestion.answers_en)
                      .slice(0, 3)
                      .map((answer, ansIdx) => (
                        <li key={ansIdx}>• {answer}</li>
                      ))}
                    {(locale === 'vi' ? displayQuestion.answers_vi : displayQuestion.answers_en).length > 3 && (
                      <li className="text-xs text-green-600">
                        +{(locale === 'vi' ? displayQuestion.answers_vi : displayQuestion.answers_en).length - 3}{' '}
                        {locale === 'vi' ? 'đáp án khác' : 'more'}
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Study Plan Preview Component (for the modal)
function StudyPlanPreview({ locale, questions }: { locale: Locale; questions: Question[] }) {
  const weeks = [
    { week: 1, category: 'american_government', questions: '1-36', count: 36 },
    { week: 2, category: 'american_government', questions: '37-72', count: 36 },
    { week: 3, category: 'american_history', questions: '73-118', count: 46 },
    { week: 4, category: 'symbols_holidays', questions: '119-128', count: 10, review: true },
  ];

  const categoryNames = {
    american_government: locale === 'vi' ? 'Chính phủ Mỹ' : 'American Government',
    american_history: locale === 'vi' ? 'Lịch sử Mỹ' : 'American History',
    symbols_holidays: locale === 'vi' ? 'Biểu tượng & Ngày lễ' : 'Symbols & Holidays',
  };

  return (
    <div className="space-y-4">
      {weeks.map((week) => (
        <div
          key={week.week}
          className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {locale === 'vi' ? `Tuần ${week.week}` : `Week ${week.week}`}
            </span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              {categoryNames[week.category as keyof typeof categoryNames]}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {locale === 'vi' ? `Câu ${week.questions}` : `Questions ${week.questions}`} ({week.count})
          </p>
          {week.review && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              + {locale === 'vi' ? 'Ôn tập tổng quát' : 'Full review'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// Study Plan Print Layout
function StudyPlanPrintLayout({ questions, locale }: { questions: Question[]; locale: Locale }) {
  const today = new Date();
  const weeks = [
    {
      week: 1,
      title: locale === 'vi' ? 'Chính phủ Mỹ (Phần 1)' : 'American Government (Part 1)',
      questions: questions.filter((q) => q.question_number >= 1 && q.question_number <= 36),
      goals: locale === 'vi'
        ? ['Học 5-6 câu mỗi ngày', 'Làm thẻ ghi nhớ', 'Bài kiểm tra cuối tuần']
        : ['Learn 5-6 questions daily', 'Make flashcards', 'Weekly quiz'],
    },
    {
      week: 2,
      title: locale === 'vi' ? 'Chính phủ Mỹ (Phần 2)' : 'American Government (Part 2)',
      questions: questions.filter((q) => q.question_number >= 37 && q.question_number <= 72),
      goals: locale === 'vi'
        ? ['Học 5-6 câu mỗi ngày', 'Ôn lại tuần 1', 'Bài kiểm tra cuối tuần']
        : ['Learn 5-6 questions daily', 'Review week 1', 'Weekly quiz'],
    },
    {
      week: 3,
      title: locale === 'vi' ? 'Lịch sử Mỹ' : 'American History',
      questions: questions.filter((q) => q.question_number >= 73 && q.question_number <= 118),
      goals: locale === 'vi'
        ? ['Học 6-7 câu mỗi ngày', 'Ôn lại chính phủ', 'Bài kiểm tra cuối tuần']
        : ['Learn 6-7 questions daily', 'Review government', 'Weekly quiz'],
    },
    {
      week: 4,
      title: locale === 'vi' ? 'Biểu tượng & Ôn tập' : 'Symbols & Review',
      questions: questions.filter((q) => q.question_number >= 119 && q.question_number <= 128),
      goals: locale === 'vi'
        ? ['Học 10 câu còn lại', 'Ôn tập tổng quát', 'Làm bài thi thử']
        : ['Learn final 10 questions', 'Full review', 'Take practice tests'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{locale === 'vi' ? 'Kế Hoạch Học 4 Tuần' : '4-Week Study Plan'}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {locale === 'vi' ? 'Thi Quốc Tịch Mỹ 2025' : 'U.S. Citizenship Test 2025'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {locale === 'vi' ? 'Bắt đầu:' : 'Start:'} {today.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
        </p>
      </div>

      {weeks.map((week) => {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + (week.week - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return (
          <div key={week.week} className="border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="font-bold text-lg">
                  {locale === 'vi' ? `Tuần ${week.week}` : `Week ${week.week}`}: {week.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {weekStart.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric' })} -{' '}
                  {weekEnd.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {week.questions.length} {locale === 'vi' ? 'câu' : 'questions'}
              </span>
            </div>

            {/* Daily checklist */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{locale === 'vi' ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][idx] : day}</p>
                  <div className="w-6 h-6 border-2 border-gray-300 rounded mx-auto" />
                </div>
              ))}
            </div>

            {/* Goals */}
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs font-medium text-gray-700 mb-1">
                {locale === 'vi' ? 'Mục tiêu:' : 'Goals:'}
              </p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {week.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="w-3 h-3 border border-gray-400 rounded-sm flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Question numbers */}
            <p className="text-xs text-gray-400 mt-2">
              {locale === 'vi' ? 'Câu hỏi:' : 'Questions:'} {week.questions.map((q) => q.question_number).join(', ')}
            </p>
          </div>
        );
      })}

      {/* Tips section */}
      <div className="border-t-2 border-gray-300 pt-4 mt-6">
        <h3 className="font-bold mb-2">{locale === 'vi' ? 'Mẹo Học Tập' : 'Study Tips'}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {locale === 'vi' ? 'Học 20-30 phút mỗi ngày' : 'Study 20-30 minutes daily'}</li>
          <li>• {locale === 'vi' ? 'Sử dụng thẻ ghi nhớ' : 'Use flashcards'}</li>
          <li>• {locale === 'vi' ? 'Làm bài thi thử hàng tuần' : 'Take weekly practice tests'}</li>
          <li>• {locale === 'vi' ? 'Ôn tập câu trả lời sai' : 'Review missed questions'}</li>
        </ul>
      </div>
    </div>
  );
}
