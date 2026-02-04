import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  FileQuestion,
  Layers,
  Star,
  Smartphone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StreakDisplay } from '@/components/ui/StreakDisplay';
import { CategoryMastery } from '@/components/ui/CategoryMastery';
import { FontSizeControl } from '@/components/ui/FontSizeControl';
import type { Locale } from '@/types';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  const features = [
    {
      icon: BookOpen,
      title: t('features.bilingual.title'),
      description: t('features.bilingual.description'),
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    },
    {
      icon: FileQuestion,
      title: t('features.practice.title'),
      description: t('features.practice.description'),
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    },
    {
      icon: Star,
      title: t('features.senior.title'),
      description: t('features.senior.description'),
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
    },
    {
      icon: Smartphone,
      title: t('features.mobile.title'),
      description: t('features.mobile.description'),
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt={locale === 'vi' ? 'Công Dân Mỹ' : 'U.S. Citizenship'}
                width={120}
                height={120}
                className="w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-lg"
                priority
              />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/study`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={`/${locale}/practice`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                  {tNav('practice')}
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">128</div>
                <div className="text-sm text-blue-200">{t('stats.questions')}</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-blue-200">{t('stats.passRate')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-blue-200">{t('stats.users')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} hoverable className="text-center">
                <div
                  className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Streak Section */}
      <section className="py-12 bg-gray-50 dark:bg-slate-800/50 transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              {locale === 'vi' ? 'Tiến Độ Học Tập' : 'Your Learning Progress'}
            </h2>
            <StreakDisplay locale={locale as Locale} />
            <CategoryMastery locale={locale as Locale} />
            <FontSizeControl locale={locale as Locale} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-800 transition-colors">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {locale === 'vi' ? 'Cách Sử Dụng' : 'How It Works'}
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: locale === 'vi' ? 'Học 128 câu hỏi' : 'Study 128 questions',
                  desc:
                    locale === 'vi'
                      ? 'Đọc và hiểu từng câu hỏi với giải thích tiếng Việt'
                      : 'Read and understand each question with Vietnamese explanations',
                },
                {
                  step: 2,
                  title: locale === 'vi' ? 'Thi thử' : 'Practice test',
                  desc:
                    locale === 'vi'
                      ? 'Làm bài thi thử 20 câu để kiểm tra kiến thức'
                      : 'Take a 20-question practice test to check your knowledge',
                },
                {
                  step: 3,
                  title: locale === 'vi' ? 'Ôn lại câu sai' : 'Review mistakes',
                  desc:
                    locale === 'vi'
                      ? 'Xem lại các câu trả lời sai và học lại'
                      : 'Review incorrect answers and study again',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-800 dark:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {locale === 'vi'
              ? 'Sẵn sàng trở thành công dân Mỹ?'
              : 'Ready to become a U.S. citizen?'}
          </h2>
          <p className="text-amber-100 mb-8 max-w-xl mx-auto">
            {locale === 'vi'
              ? 'Bắt đầu học ngay hôm nay và chuẩn bị tốt nhất cho bài thi quốc tịch.'
              : 'Start studying today and prepare well for your citizenship test.'}
          </p>
          <Link href={`/${locale}/study`}>
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
              {locale === 'vi' ? 'Bắt Đầu Học' : 'Start Learning'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
