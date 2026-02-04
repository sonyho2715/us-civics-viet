import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { InterviewContent } from './InterviewContent';
import type { Locale } from '@/types';
import type { Metadata } from 'next';

interface InterviewPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: InterviewPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'vi'
      ? 'Mô Phỏng Phỏng Vấn - Thi Quốc Tịch Mỹ'
      : 'Interview Simulation - U.S. Citizenship Test',
    description: locale === 'vi'
      ? 'Luyện tập phỏng vấn quốc tịch Mỹ với mô phỏng thực tế từ viên chức USCIS'
      : 'Practice U.S. citizenship interview with realistic USCIS officer simulation',
  };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InterviewContent locale={locale as Locale} />;
}
