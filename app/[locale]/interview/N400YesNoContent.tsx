'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Eye, EyeOff, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import questionsData from '@/data/n400-yes-no-questions.json';
import type { Locale } from '@/types';

interface N400Question {
  id: number;
  question_en: string;
  question_vi: string;
  answer_en: string;
  answer_vi: string;
}

const questions = questionsData.questions as N400Question[];

interface Props {
  locale: Locale;
}

export function N400YesNoContent({ locale }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiced, setPracticed] = useState<Set<number>>(new Set());
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const current = questions[currentIndex];
  const progress = (practiced.size / questions.length) * 100;

  const handleSpeak = (text: string, lang: 'en' | 'vi') => {
    if (isSpeaking) stop();
    setTimeout(() => speak(text, lang), 50);
  };

  const handleReveal = () => {
    setShowAnswer(true);
    setPracticed((prev) => new Set(prev).add(current.id));
  };

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
    setShowAnswer(false);
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setShowAnswer(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setPracticed(new Set());
  };

  const isVi = locale === 'vi';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header info */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          {isVi ? questionsData.metadata.note_vi : questionsData.metadata.note_en}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isVi ? 'Câu hỏi' : 'Question'} {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {practiced.size} {isVi ? 'đã luyện' : 'practiced'}
          </span>
        </div>
        <ProgressBar progress={progress} color="green" size="sm" />
      </div>

      {/* Question Card */}
      <Card className="mb-4 p-6">
        {/* Question number badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 bg-blue-800 dark:bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
            {current.id}
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            N-400 Part 10
          </span>
        </div>

        {/* Officer prompt */}
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          {isVi ? 'Viên chức hỏi:' : 'Officer asks:'}
        </p>

        {/* Question text */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {isVi ? current.question_vi : current.question_en}
        </p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
          {isVi ? current.question_en : current.question_vi}
        </p>

        {/* Audio buttons for question */}
        {ttsSupported && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleSpeak(current.question_en, 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Volume2 className="w-3 h-3" />
              EN
            </button>
            <button
              onClick={() => handleSpeak(current.question_vi, 'vi')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <Volume2 className="w-3 h-3" />
              VI
            </button>
          </div>
        )}

        {/* Reveal button or answer */}
        {!showAnswer ? (
          <button
            onClick={handleReveal}
            className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            {isVi ? 'Xem câu trả lời gợi ý' : 'Reveal suggested answer'}
          </button>
        ) : (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isVi ? 'Câu trả lời gợi ý:' : 'Suggested answer:'}
            </p>
            <p className="text-base font-semibold text-green-900 dark:text-green-200 mb-1">
              {isVi ? current.answer_vi : current.answer_en}
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {isVi ? current.answer_en : current.answer_vi}
            </p>

            {/* Audio buttons for answer */}
            {ttsSupported && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleSpeak(current.answer_en, 'en')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors shadow-sm"
                >
                  <Volume2 className="w-3 h-3" />
                  {isVi ? 'Nghe tiếng Anh' : 'Listen EN'}
                </button>
                <button
                  onClick={() => handleSpeak(current.answer_vi, 'vi')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm"
                >
                  <Volume2 className="w-3 h-3" />
                  {isVi ? 'Nghe tiếng Việt' : 'Listen VI'}
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          {isVi ? 'Trước' : 'Previous'}
        </Button>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          title={isVi ? 'Bắt đầu lại' : 'Reset'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          {isVi ? 'Tiếp' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Completion message */}
      {practiced.size === questions.length && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700 text-center">
          <p className="text-amber-800 dark:text-amber-300 font-semibold">
            {isVi ? '🎉 Xuất sắc! Bạn đã luyện tất cả 32 câu hỏi!' : '🎉 Excellent! You practiced all 32 questions!'}
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            {isVi ? 'Tiếp tục ôn lại cho đến khi bạn tự tin.' : 'Keep reviewing until you feel confident.'}
          </p>
        </div>
      )}
    </div>
  );
}
