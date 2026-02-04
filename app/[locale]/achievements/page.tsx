import { setRequestLocale } from 'next-intl/server';
import { AchievementsContent } from './AchievementsContent';

interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AchievementsPage({ params }: AchievementsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AchievementsContent locale={locale} />;
}
