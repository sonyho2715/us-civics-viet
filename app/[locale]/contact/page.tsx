import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ContactContent } from './ContactContent';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Liên Hệ - Công Dân Mỹ',
    en: 'Contact Us - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Liên hệ với chúng tôi để đặt câu hỏi, báo lỗi, hoặc góp ý cải thiện ứng dụng học thi quốc tịch Mỹ.',
    en: 'Contact us for questions, bug reports, or suggestions to improve the U.S. citizenship test study app.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent locale={locale} />;
}
