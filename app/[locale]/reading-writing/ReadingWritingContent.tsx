'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  PenTool,
  Volume2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Shuffle,
  Check,
  X,
  GraduationCap,
  List,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { shuffleArray } from '@/lib/test-logic';
import type { Locale } from '@/types';

// Import vocabulary data
import readingVocab from '@/data/reading-vocabulary.json';
import writingVocab from '@/data/writing-vocabulary.json';

type VocabularyWord = {
  word: string;
  pronunciation?: string;
  translation_vi: string;
  definition_en: string;
  definition_vi: string;
  example_en: string;
  example_vi: string;
};

type VocabularyCategory = {
  name_en: string;
  name_vi: string;
  description_en: string;
  description_vi: string;
  words: VocabularyWord[];
};

type Mode = 'browse' | 'flashcard' | 'practice';
type TestType = 'reading' | 'writing';

export function ReadingWritingContent() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = useTranslations('readingWriting');

  const [mode, setMode] = useState<Mode>('browse');
  const [testType, setTestType] = useState<TestType>('reading');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardDeck, setFlashcardDeck] = useState<VocabularyWord[]>([]);
  const [studiedWords, setStudiedWords] = useState<Set<string>>(new Set());
  const [practiceInput, setPracticeInput] = useState('');
  const [showPracticeResult, setShowPracticeResult] = useState(false);
  const [isPracticeCorrect, setIsPracticeCorrect] = useState(false);

  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  // Get current vocabulary based on test type
  const currentVocabData = testType === 'reading' ? readingVocab : writingVocab;
  const categories = currentVocabData.categories as Record<string, VocabularyCategory>;

  // Get all words or filtered by category
  const getAllWords = (): VocabularyWord[] => {
    const allWords: VocabularyWord[] = [];
    Object.values(categories).forEach((category) => {
      allWords.push(...category.words);
    });
    return allWords;
  };

  const getFilteredWords = (): VocabularyWord[] => {
    if (!selectedCategory) {
      return getAllWords();
    }
    return categories[selectedCategory]?.words || [];
  };

  // Initialize flashcard deck when mode or filters change
  useEffect(() => {
    if (mode === 'flashcard' || mode === 'practice') {
      const words = getFilteredWords();
      setFlashcardDeck(shuffleArray([...words]));
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setPracticeInput('');
      setShowPracticeResult(false);
    }
  }, [mode, testType, selectedCategory]);

  const currentCard = flashcardDeck[currentCardIndex];

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stop();
    }
    setTimeout(() => speak(text, 'en'), 50);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && currentCard) {
      setStudiedWords((prev) => new Set(prev).add(currentCard.word));
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcardDeck.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setPracticeInput('');
      setShowPracticeResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setPracticeInput('');
      setShowPracticeResult(false);
    }
  };

  const handleShuffle = () => {
    setFlashcardDeck(shuffleArray([...flashcardDeck]));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setPracticeInput('');
    setShowPracticeResult(false);
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedWords(new Set());
    setPracticeInput('');
    setShowPracticeResult(false);
  };

  const handleCheckAnswer = () => {
    if (!currentCard || !practiceInput.trim()) return;

    const userAnswer = practiceInput.trim().toLowerCase();
    const correctAnswer = currentCard.word.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    setIsPracticeCorrect(isCorrect);
    setShowPracticeResult(true);

    if (isCorrect) {
      setStudiedWords((prev) => new Set(prev).add(currentCard.word));
    }
  };

  const handlePracticeNext = () => {
    if (isPracticeCorrect) {
      handleNext();
    } else {
      setPracticeInput('');
      setShowPracticeResult(false);
    }
  };

  const progress = flashcardDeck.length > 0
    ? ((currentCardIndex + 1) / flashcardDeck.length) * 100
    : 0;

  const studiedProgress = flashcardDeck.length > 0
    ? (studiedWords.size / flashcardDeck.length) * 100
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === 'vi' ? 'Đọc và Viết' : 'Reading and Writing'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {locale === 'vi'
            ? 'Luyện tập từ vựng USCIS cho bài kiểm tra đọc và viết'
            : 'Practice USCIS vocabulary for reading and writing test'}
        </p>
      </div>

      {/* Test Type Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setTestType('reading');
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              testType === 'reading'
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {locale === 'vi' ? 'Đọc' : 'Reading'}
            <Badge variant="info" className="ml-1">
              {getAllWords().length}
            </Badge>
          </button>
          <button
            onClick={() => {
              setTestType('writing');
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              testType === 'writing'
                ? 'bg-green-600 dark:bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <PenTool className="w-4 h-4" />
            {locale === 'vi' ? 'Viết' : 'Writing'}
            <Badge variant="info" className="ml-1">
              {Object.values(writingVocab.categories).reduce(
                (sum, cat) => sum + (cat as VocabularyCategory).words.length,
                0
              )}
            </Badge>
          </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMode('browse')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'browse'
                ? 'bg-purple-600 dark:bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
            {locale === 'vi' ? 'Danh sách' : 'Browse'}
          </button>
          <button
            onClick={() => setMode('flashcard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'flashcard'
                ? 'bg-purple-600 dark:bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {locale === 'vi' ? 'Thẻ ghi nhớ' : 'Flashcards'}
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'practice'
                ? 'bg-purple-600 dark:bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <PenTool className="w-4 h-4" />
            {locale === 'vi' ? 'Luyện viết' : 'Practice'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-amber-500 dark:bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {locale === 'vi' ? 'Tất cả' : 'All'}
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === key
                  ? 'bg-amber-500 dark:bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {locale === 'vi' ? category.name_vi : category.name_en}
              <span className="ml-1.5 text-xs opacity-80">
                ({category.words.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Browse Mode */}
      {mode === 'browse' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredWords().map((word, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{word.word}</CardTitle>
                    {word.pronunciation && (
                      <CardDescription className="mt-1 font-mono text-xs">
                        {word.pronunciation}
                      </CardDescription>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {word.translation_vi}
                    </p>
                  </div>
                  {ttsSupported && (
                    <button
                      onClick={() => handleSpeak(word.word)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                      aria-label={locale === 'vi' ? 'Nghe phát âm' : 'Listen'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {locale === 'vi' ? 'Định nghĩa:' : 'Definition:'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === 'vi' ? word.definition_vi : word.definition_en}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {locale === 'vi' ? 'Ví dụ:' : 'Example:'}
                    </p>
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                      {locale === 'vi' ? word.example_vi : word.example_en}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Flashcard Mode */}
      {mode === 'flashcard' && flashcardDeck.length > 0 && (
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {locale === 'vi' ? 'Từ' : 'Word'} {currentCardIndex + 1}/{flashcardDeck.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {studiedWords.size} {locale === 'vi' ? 'đã học' : 'studied'}
              </span>
            </div>
            <ProgressBar progress={studiedProgress} color="purple" size="sm" />
          </div>

          {/* Flashcard */}
          <div
            className="relative w-full h-80 md:h-96 cursor-pointer mb-6 perspective-1000"
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <div
                className="absolute w-full h-full backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Card className="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 border-2 border-blue-200 dark:border-blue-700">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-blue-400 dark:text-blue-300 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {currentCard.word}
                    </h2>
                    {currentCard.pronunciation && (
                      <p className="text-gray-500 dark:text-gray-400 font-mono mb-4">
                        {currentCard.pronunciation}
                      </p>
                    )}
                    {ttsSupported && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentCard.word);
                        }}
                        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-white/80 dark:bg-slate-700/80 text-blue-700 dark:text-blue-300 hover:bg-white dark:hover:bg-slate-600 transition-colors shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                        {locale === 'vi' ? 'Nghe' : 'Listen'}
                      </button>
                    )}
                  </div>
                  <p className="absolute bottom-4 text-sm text-blue-600 dark:text-blue-300">
                    {locale === 'vi' ? 'Nhấn để xem nghĩa' : 'Click to see meaning'}
                  </p>
                </Card>
              </div>

              {/* Back */}
              <div
                className="absolute w-full h-full backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <Card className="h-full flex flex-col justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-2 border-green-200 dark:border-green-700 overflow-y-auto">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
                      {currentCard.translation_vi}
                    </h3>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {locale === 'vi' ? 'Định nghĩa:' : 'Definition:'}
                      </p>
                      <p className="text-gray-800 dark:text-white">
                        {locale === 'vi' ? currentCard.definition_vi : currentCard.definition_en}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {locale === 'vi' ? 'Ví dụ:' : 'Example:'}
                      </p>
                      <p className="italic text-gray-700 dark:text-gray-200">
                        {locale === 'vi' ? currentCard.example_vi : currentCard.example_en}
                      </p>
                    </div>
                  </div>
                  <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-green-600 dark:text-green-300">
                    {locale === 'vi' ? 'Nhấn để xem từ' : 'Click to see word'}
                  </p>
                </Card>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {locale === 'vi' ? 'Trước' : 'Previous'}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleShuffle}>
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentCardIndex === flashcardDeck.length - 1}
            >
              {locale === 'vi' ? 'Sau' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Practice Mode */}
      {mode === 'practice' && flashcardDeck.length > 0 && (
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {locale === 'vi' ? 'Từ' : 'Word'} {currentCardIndex + 1}/{flashcardDeck.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {studiedWords.size} {locale === 'vi' ? 'đúng' : 'correct'}
              </span>
            </div>
            <ProgressBar progress={progress} color="green" size="sm" />
          </div>

          {/* Practice Card */}
          <Card className="mb-6 p-8">
            <div className="text-center space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {locale === 'vi' ? 'Viết từ này:' : 'Write this word:'}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentCard.translation_vi}
                </h2>
                {ttsSupported && (
                  <button
                    onClick={() => handleSpeak(currentCard.word)}
                    className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    {locale === 'vi' ? 'Nghe phát âm' : 'Listen to pronunciation'}
                  </button>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={practiceInput}
                  onChange={(e) => setPracticeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !showPracticeResult) {
                      handleCheckAnswer();
                    }
                  }}
                  placeholder={locale === 'vi' ? 'Nhập câu trả lời...' : 'Type your answer...'}
                  disabled={showPracticeResult}
                  className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                />
              </div>

              {showPracticeResult && (
                <div
                  className={`p-4 rounded-lg ${
                    isPracticeCorrect
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isPracticeCorrect ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">
                          {locale === 'vi' ? 'Đúng!' : 'Correct!'}
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        <span className="font-semibold">
                          {locale === 'vi' ? 'Sai' : 'Incorrect'}
                        </span>
                      </>
                    )}
                  </div>
                  {!isPracticeCorrect && (
                    <p className="text-sm">
                      {locale === 'vi' ? 'Đáp án đúng:' : 'Correct answer:'}{' '}
                      <span className="font-bold">{currentCard.word}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {!showPracticeResult ? (
                  <Button onClick={handleCheckAnswer} disabled={!practiceInput.trim()}>
                    {locale === 'vi' ? 'Kiểm tra' : 'Check Answer'}
                  </Button>
                ) : (
                  <Button onClick={handlePracticeNext}>
                    {isPracticeCorrect
                      ? locale === 'vi'
                        ? 'Tiếp tục'
                        : 'Next'
                      : locale === 'vi'
                        ? 'Thử lại'
                        : 'Try Again'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {locale === 'vi' ? 'Trước' : 'Previous'}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleShuffle}>
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentCardIndex === flashcardDeck.length - 1}
            >
              {locale === 'vi' ? 'Sau' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(mode === 'flashcard' || mode === 'practice') && flashcardDeck.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {locale === 'vi' ? 'Không có từ nào' : 'No words available'}
          </p>
        </Card>
      )}
    </div>
  );
}
