import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ExamDayContent } from './ExamDayContent';

interface ExamDayPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ExamDayPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Ngày Thi - Chuẩn Bị Phỏng Vấn Quốc Tịch',
    en: 'Exam Day - Citizenship Interview Preparation',
  };

  const descriptions = {
    vi: 'Danh sách chuẩn bị ngày phỏng vấn quốc tịch Mỹ. Giấy tờ cần mang, mẹo thi, và quy trình phỏng vấn.',
    en: 'U.S. citizenship interview day preparation checklist. Documents to bring, test tips, and interview process.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

export default async function ExamDayPage({ params }: ExamDayPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExamDayContent />;
}
