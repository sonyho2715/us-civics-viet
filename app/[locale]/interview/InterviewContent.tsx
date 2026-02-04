'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  ClipboardCheck,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Star,
  AlertCircle,
  ChevronRight,
  Gauge,
  Users,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getAllQuestions, getSeniorQuestions } from '@/lib/questions';
import type { Locale, Question } from '@/types';

interface InterviewContentProps {
  locale: Locale;
}

type InterviewMode = 'standard' | '65_20' | null;
type InterviewStatus = 'intro' | 'interview' | 'results';
type QuestionStatus = 'correct' | 'needsReview' | 'unanswered';
type AudioSpeed = 0.75 | 1.0 | 1.25;

interface QuestionResponse {
  questionId: number;
  status: QuestionStatus;
  userAnswer?: string;
}

export function InterviewContent({ locale }: InterviewContentProps) {
  const t = useTranslations('interview');
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>('intro');
  const [mode, setMode] = useState<InterviewMode>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [audioSpeed, setAudioSpeed] = useState<AudioSpeed>(1.0);
  const [showTips, setShowTips] = useState(false);

  // Shuffle and select 10 random questions when interview starts
  const startInterview = useCallback((selectedMode: InterviewMode) => {
    if (!selectedMode) return;

    const allQuestions = selectedMode === '65_20'
      ? getSeniorQuestions()
      : getAllQuestions();

    // Shuffle and select 10 questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    setMode(selectedMode);
    setQuestions(selected);
    setResponses(selected.map(q => ({
      questionId: q.id,
      status: 'unanswered',
    })));
    setCurrentIndex(0);
    setInterviewStatus('interview');

    // Auto-play first question after a short delay
    setTimeout(() => {
      if (selected[0]) {
        playQuestion(selected[0].question_en);
      }
    }, 1000);
  }, []);

  const playQuestion = useCallback((text: string) => {
    if (!ttsSupported) return;

    if (isSpeaking) {
      stop();
    }

    // Create custom speech with speed control
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = audioSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to get a US English voice
        const voices = window.speechSynthesis.getVoices();
        const usVoice = voices.find(v => v.lang === 'en-US');
        if (usVoice) {
          utterance.voice = usVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    }, 50);
  }, [ttsSupported, isSpeaking, stop, audioSpeed]);

  const handleResponse = useCallback((status: QuestionStatus) => {
    const updatedResponses = [...responses];
    updatedResponses[currentIndex] = {
      ...updatedResponses[currentIndex],
      status,
      userAnswer: userAnswer.trim() || undefined,
    };
    setResponses(updatedResponses);
    setUserAnswer('');

    // Auto-advance to next question or results
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Auto-play next question
      setTimeout(() => {
        playQuestion(questions[nextIndex].question_en);
      }, 500);
    } else {
      // Interview complete
      setInterviewStatus('results');
      stop();
    }
  }, [responses, currentIndex, questions, userAnswer, playQuestion, stop]);

  const resetInterview = () => {
    stop();
    setInterviewStatus('intro');
    setMode(null);
    setQuestions([]);
    setResponses([]);
    setCurrentIndex(0);
    setUserAnswer('');
  };

  const currentQuestion = questions[currentIndex];
  const correctCount = responses.filter(r => r.status === 'correct').length;
  const passed = correctCount >= 6;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Intro screen
  if (interviewStatus === 'intro') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <ClipboardCheck className="w-8 h-8 text-blue-800 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('intro.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              {t('intro.description')}
            </p>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('intro.howItWorks')}
              </h3>
              <ul className="space-y-2">
                {[
                  t('intro.step1'),
                  t('intro.step2'),
                  t('intro.step3'),
                  t('intro.step4'),
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-600 dark:text-slate-400 text-sm">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{t('intro.ready')}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => startInterview('standard')}
                className="p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('modes.standard')}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {locale === 'vi'
                    ? 'Câu hỏi từ tất cả 128 câu hỏi công dân'
                    : 'Questions from all 128 civics questions'}
                </p>
              </button>

              <button
                onClick={() => startInterview('65_20')}
                className="p-4 border-2 border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('modes.senior')}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {locale === 'vi'
                    ? 'Dành cho người 65+ sống tại Mỹ 20+ năm'
                    : 'For seniors 65+ living in U.S. 20+ years'}
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Interview Tips Section */}
        <Card>
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors rounded-xl"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('tips.title')}
              </h3>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showTips ? 'rotate-90' : ''}`} />
          </button>

          {showTips && (
            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Before Interview */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('tips.beforeInterview.title')}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      t('tips.beforeInterview.tip1'),
                      t('tips.beforeInterview.tip2'),
                      t('tips.beforeInterview.tip3'),
                      t('tips.beforeInterview.tip4'),
                      t('tips.beforeInterview.tip5'),
                    ].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* During Interview */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('tips.duringInterview.title')}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      t('tips.duringInterview.tip1'),
                      t('tips.duringInterview.tip2'),
                      t('tips.duringInterview.tip3'),
                      t('tips.duringInterview.tip4'),
                      t('tips.duringInterview.tip5'),
                    ].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('tips.commonMistakes.title')}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      t('tips.commonMistakes.mistake1'),
                      t('tips.commonMistakes.mistake2'),
                      t('tips.commonMistakes.mistake3'),
                      t('tips.commonMistakes.mistake4'),
                      t('tips.commonMistakes.mistake5'),
                    ].map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  // Interview in progress
  if (interviewStatus === 'interview' && currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('officer')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('question')} {currentIndex + 1} {t('of')} {questions.length}
              </p>
            </div>
            {mode === '65_20' && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                65/20
              </Badge>
            )}
          </div>

          <ProgressBar
            progress={progress}
            color="blue"
            size="sm"
            showLabel
            label={`${correctCount}/6 ${locale === 'vi' ? 'đúng' : 'correct'}`}
          />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="space-y-4">
            {/* Question badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">#{currentQuestion.question_number}</Badge>
              {currentQuestion.is_65_20 && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  65/20
                </Badge>
              )}
              {currentQuestion.is_dynamic && (
                <Badge variant="error" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {locale === 'vi' ? 'Có thể thay đổi' : 'May change'}
                </Badge>
              )}
            </div>

            {/* Question text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentQuestion.question_en}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {currentQuestion.question_vi}
              </p>
            </div>

            {/* Audio controls */}
            {ttsSupported && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isSpeaking ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => {
                      if (isSpeaking) {
                        stop();
                      } else {
                        playQuestion(currentQuestion.question_en);
                      }
                    }}
                    className="flex-1"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-2" />
                        {t('stopAudio')}
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        {t('playAudio')}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playQuestion(currentQuestion.question_en)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Speed control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Gauge className="w-4 h-4" />
                    {t('speed')}
                  </span>
                  <div className="flex gap-1">
                    {[
                      { value: 0.75, label: t('slow') },
                      { value: 1.0, label: t('normal') },
                      { value: 1.25, label: t('fast') },
                    ].map(speed => (
                      <button
                        key={speed.value}
                        onClick={() => setAudioSpeed(speed.value as AudioSpeed)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          audioSpeed === speed.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {speed.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* User answer input (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('yourResponse')}
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder={t('typeAnswer')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Self-assessment buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('selfAssess')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleResponse('correct')}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t('iAnsweredCorrectly')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResponse('needsReview')}
                  className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t('iNeedToReview')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question navigation pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((q, idx) => {
            const response = responses[idx];
            return (
              <div
                key={q.id}
                className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center ${
                  idx === currentIndex
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-500'
                    : response.status === 'correct'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                      : response.status === 'needsReview'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                }`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Results screen
  if (interviewStatus === 'results') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
              passed
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {passed ? (
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('results.title')}
          </h1>
          <p className={`text-xl ${
            passed
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {passed ? t('results.passed') : t('results.failed')}
          </p>
        </div>

        {/* Score card */}
        <Card className="mb-6">
          <CardContent>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {correctCount}/10
              </div>
              <p className="text-gray-600 dark:text-slate-400">
                {t('results.correctCount', { count: correctCount })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('results.passRequirement')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Questions review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('results.questionsReview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, idx) => {
                const response = responses[idx];
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      response.status === 'correct'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        response.status === 'correct'
                          ? 'bg-green-600 dark:bg-green-500'
                          : 'bg-red-600 dark:bg-red-500'
                      }`}>
                        {response.status === 'correct' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="info">#{question.question_number}</Badge>
                          <span className={`text-sm font-medium ${
                            response.status === 'correct'
                              ? 'text-green-800 dark:text-green-300'
                              : 'text-red-800 dark:text-red-300'
                          }`}>
                            {response.status === 'correct' ? t('status.correct') : t('status.needsReview')}
                          </span>
                        </div>

                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          {question.question_en}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                          {question.question_vi}
                        </p>

                        {response.userAnswer && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                              {t('results.yourAnswer')}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-slate-400 ml-2">
                              {response.userAnswer}
                            </span>
                          </div>
                        )}

                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            {t('results.correctAnswers')}
                          </span>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 mt-1">
                            {(locale === 'vi' ? question.answers_vi : question.answers_en).map((answer, i) => (
                              <li key={i}>{answer}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={resetInterview}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('results.tryAgain')}
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = `/${locale}/study`)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t('results.backToStudy')}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
