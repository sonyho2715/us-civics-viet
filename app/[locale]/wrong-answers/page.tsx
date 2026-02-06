import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { WrongAnswerDrillContent } from './WrongAnswerDrillContent';

interface WrongAnswersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WrongAnswersPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Luyện Câu Sai - Công Dân Mỹ',
    en: 'Wrong Answer Drills - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Ôn tập lại những câu hỏi bạn đã trả lời sai. Tập trung vào điểm yếu để cải thiện kết quả thi.',
    en: 'Review questions you answered incorrectly. Focus on weak areas to improve your test results.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

export default async function WrongAnswersPage({ params }: WrongAnswersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WrongAnswerDrillContent />;
}
