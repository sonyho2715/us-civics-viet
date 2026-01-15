import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FlashcardsContent } from './FlashcardsContent';

interface FlashcardsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FlashcardsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Thẻ Ghi Nhớ - Công Dân Mỹ',
    en: 'Flashcards - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Học 128 câu hỏi thi quốc tịch Mỹ với thẻ ghi nhớ. Hỗ trợ lặp lại ngắt quãng, đánh dấu, và chế độ 65/20.',
    en: 'Study 128 U.S. citizenship test questions with flashcards. Supports spaced repetition, bookmarks, and 65/20 mode.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

export default async function FlashcardsPage({ params }: FlashcardsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FlashcardsContent />;
}
