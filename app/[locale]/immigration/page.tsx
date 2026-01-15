import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ImmigrationContent } from './ImmigrationContent';

interface ImmigrationPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ImmigrationPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Hướng Dẫn Phỏng Vấn Di Trú - Công Dân Mỹ',
    en: 'Immigration Interview Guide - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Hướng dẫn chi tiết cho phỏng vấn thẻ xanh và quốc tịch Mỹ. 280+ câu hỏi, lệ phí, và mẹo chuẩn bị.',
    en: 'Comprehensive guide for green card and citizenship interviews. 280+ questions, fees, and preparation tips.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

export default async function ImmigrationGuidePage({ params }: ImmigrationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ImmigrationContent />;
}
