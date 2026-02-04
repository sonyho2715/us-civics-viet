import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReadingWritingContent } from './ReadingWritingContent';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('readingWriting');

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ReadingWritingPage() {
  return <ReadingWritingContent />;
}
