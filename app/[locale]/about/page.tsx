import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, Users, Target, Heart, BookOpen, Globe, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Về Chúng Tôi - Công Dân Mỹ',
    en: 'About Us - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Tìm hiểu về Công Dân Mỹ - ứng dụng học thi quốc tịch Mỹ miễn phí dành cho cộng đồng người Việt.',
    en: 'Learn about U.S. Citizenship - a free citizenship test study app for the Vietnamese community.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Về Chúng Tôi',
    back: 'Trang chủ',
    mission: {
      title: 'Sứ Mệnh Của Chúng Tôi',
      description: 'Công Dân Mỹ được tạo ra để giúp cộng đồng người Việt chuẩn bị cho bài thi quốc tịch Hoa Kỳ. Chúng tôi hiểu rằng quá trình nhập tịch có thể khó khăn, đặc biệt khi phải học bằng ngôn ngữ thứ hai. Vì vậy, chúng tôi cung cấp tất cả nội dung bằng cả tiếng Việt và tiếng Anh.'
    },
    features: [
      {
        iconKey: 'bookOpen',
        title: '128 Câu Hỏi Chính Thức',
        description: 'Tất cả câu hỏi từ USCIS với bản dịch tiếng Việt chính xác và giải thích chi tiết.'
      },
      {
        iconKey: 'star',
        title: 'Chế Độ 65/20',
        description: 'Dành riêng cho người cao tuổi từ 65 tuổi trở lên với 20 năm cư trú, chỉ cần học 20 câu hỏi được đánh dấu sao.'
      },
      {
        iconKey: 'globe',
        title: 'Song Ngữ Hoàn Toàn',
        description: 'Giao diện và nội dung hoàn toàn bằng tiếng Việt và tiếng Anh, giúp bạn học hiệu quả hơn.'
      },
      {
        iconKey: 'target',
        title: 'Thi Thử Thực Tế',
        description: 'Bài thi thử mô phỏng thực tế với 20 câu hỏi ngẫu nhiên và yêu cầu đúng 12 câu để đậu.'
      }
    ],
    whyUs: {
      title: 'Tại Sao Chọn Chúng Tôi?',
      reasons: [
        'Hoàn toàn miễn phí, không cần đăng ký',
        'Cập nhật theo bộ câu hỏi mới nhất 2025 của USCIS',
        'Thiết kế thân thiện với điện thoại di động',
        'Hướng dẫn di trú chi tiết cho phỏng vấn thẻ xanh',
        'Không thu thập thông tin cá nhân',
        'Được phát triển bởi cộng đồng người Việt tại Mỹ'
      ]
    },
    stats: {
      title: 'Con Số Ấn Tượng',
      items: [
        { value: '128', label: 'Câu hỏi' },
        { value: '91%', label: 'Tỷ lệ đậu' },
        { value: '2', label: 'Ngôn ngữ' },
        { value: '100%', label: 'Miễn phí' }
      ]
    },
    disclaimer: {
      title: 'Lưu Ý Quan Trọng',
      text: 'Công Dân Mỹ là trang web học tập độc lập, không liên kết với USCIS hoặc chính phủ Hoa Kỳ. Thông tin có thể thay đổi. Vui lòng xác minh tại uscis.gov trước phỏng vấn.'
    }
  },
  en: {
    title: 'About Us',
    back: 'Home',
    mission: {
      title: 'Our Mission',
      description: 'U.S. Citizenship was created to help the Vietnamese community prepare for the U.S. citizenship test. We understand that the naturalization process can be challenging, especially when studying in a second language. That\'s why we provide all content in both Vietnamese and English.'
    },
    features: [
      {
        iconKey: 'bookOpen',
        title: '128 Official Questions',
        description: 'All questions from USCIS with accurate Vietnamese translations and detailed explanations.'
      },
      {
        iconKey: 'star',
        title: '65/20 Mode',
        description: 'Designed for seniors 65 and older with 20 years of residency, only need to study 20 starred questions.'
      },
      {
        iconKey: 'globe',
        title: 'Fully Bilingual',
        description: 'Interface and content completely in Vietnamese and English, helping you study more effectively.'
      },
      {
        iconKey: 'target',
        title: 'Realistic Practice Tests',
        description: 'Practice tests simulating the real exam with 20 random questions, requiring 12 correct to pass.'
      }
    ],
    whyUs: {
      title: 'Why Choose Us?',
      reasons: [
        'Completely free, no registration required',
        'Updated with the latest 2025 USCIS question set',
        'Mobile-friendly design',
        'Detailed immigration guide for green card interviews',
        'No personal information collected',
        'Developed by the Vietnamese community in America'
      ]
    },
    stats: {
      title: 'Impressive Numbers',
      items: [
        { value: '128', label: 'Questions' },
        { value: '91%', label: 'Pass Rate' },
        { value: '2', label: 'Languages' },
        { value: '100%', label: 'Free' }
      ]
    },
    disclaimer: {
      title: 'Important Notice',
      text: 'U.S. Citizenship is an independent study website, not affiliated with USCIS or the U.S. government. Information may change. Please verify at uscis.gov before your interview.'
    }
  }
};

const iconMap = {
  bookOpen: BookOpen,
  star: Star,
  globe: Globe,
  target: Target,
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = content[locale as Locale] || content.vi;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.back}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
      </div>

      {/* Mission */}
      <Card className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t.mission.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.mission.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {t.features.map((feature, idx) => {
          const IconComponent = iconMap[feature.iconKey as keyof typeof iconMap];
          return (
            <Card key={idx}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stats */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          {t.stats.title}
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {t.stats.items.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Why Us */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.whyUs.title}
        </h2>
        <ul className="space-y-2">
          {t.whyUs.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <span className="text-green-500 mt-1" aria-hidden="true">✓</span>
              {reason}
            </li>
          ))}
        </ul>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
          {t.disclaimer.title}
        </h2>
        <p className="text-amber-700 dark:text-amber-200 text-sm">
          {t.disclaimer.text}
        </p>
      </Card>
    </div>
  );
}
