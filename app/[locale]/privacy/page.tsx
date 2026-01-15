import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, Shield, Cookie, Eye, Mail, Server } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Chính Sách Bảo Mật - Công Dân Mỹ',
    en: 'Privacy Policy - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Chính sách bảo mật của Công Dân Mỹ. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.',
    en: 'Privacy policy for U.S. Citizenship. Learn how we collect, use, and protect your information.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Chính Sách Bảo Mật',
    lastUpdated: 'Cập nhật lần cuối: Tháng 1, 2026',
    back: 'Trang chủ',
    intro: 'Chúng tôi tại Công Dân Mỹ cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.',
    sections: [
      {
        iconKey: 'eye',
        title: 'Thông Tin Chúng Tôi Thu Thập',
        items: [
          'Dữ liệu sử dụng ẩn danh (trang truy cập, thời gian trên trang)',
          'Thông tin thiết bị (loại trình duyệt, hệ điều hành)',
          'Tiến độ học tập được lưu trữ cục bộ trên thiết bị của bạn',
          'Chúng tôi KHÔNG thu thập tên, email, hoặc thông tin cá nhân nhận dạng'
        ]
      },
      {
        iconKey: 'cookie',
        title: 'Cookies và Công Nghệ Theo Dõi',
        items: [
          'Cookies cần thiết để ghi nhớ tùy chọn ngôn ngữ của bạn',
          'Cookies phân tích từ Google Analytics để hiểu cách người dùng sử dụng trang',
          'Cookies quảng cáo từ Google AdSense để hiển thị quảng cáo phù hợp',
          'Bạn có thể tắt cookies trong cài đặt trình duyệt'
        ]
      },
      {
        iconKey: 'server',
        title: 'Google AdSense',
        items: [
          'Chúng tôi sử dụng Google AdSense để hiển thị quảng cáo',
          'Google có thể sử dụng cookies để hiển thị quảng cáo dựa trên lịch sử duyệt web',
          'Bạn có thể tùy chỉnh quảng cáo tại adssettings.google.com',
          'Để biết thêm, xem Chính sách bảo mật của Google'
        ]
      },
      {
        iconKey: 'shield',
        title: 'Bảo Mật Dữ Liệu',
        items: [
          'Dữ liệu học tập được lưu trữ cục bộ trên thiết bị của bạn',
          'Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba',
          'Trang web sử dụng HTTPS để mã hóa dữ liệu truyền tải',
          'Chúng tôi không yêu cầu đăng ký hoặc tạo tài khoản'
        ]
      },
      {
        iconKey: 'mail',
        title: 'Quyền Của Bạn',
        items: [
          'Xóa dữ liệu cục bộ bằng cách xóa bộ nhớ trình duyệt',
          'Từ chối cookies qua cài đặt trình duyệt',
          'Tùy chỉnh quảng cáo Google tại adssettings.google.com',
          'Liên hệ chúng tôi nếu có câu hỏi về quyền riêng tư'
        ]
      }
    ],
    contact: 'Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ chúng tôi qua trang Liên Hệ.',
    contactLinkText: 'Trang Liên Hệ'
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 2026',
    back: 'Home',
    intro: 'At U.S. Citizenship, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your information.',
    sections: [
      {
        iconKey: 'eye',
        title: 'Information We Collect',
        items: [
          'Anonymous usage data (pages visited, time on page)',
          'Device information (browser type, operating system)',
          'Study progress stored locally on your device',
          'We do NOT collect names, emails, or personally identifiable information'
        ]
      },
      {
        iconKey: 'cookie',
        title: 'Cookies and Tracking Technologies',
        items: [
          'Essential cookies to remember your language preference',
          'Analytics cookies from Google Analytics to understand how users interact with our site',
          'Advertising cookies from Google AdSense to display relevant ads',
          'You can disable cookies in your browser settings'
        ]
      },
      {
        iconKey: 'server',
        title: 'Google AdSense',
        items: [
          'We use Google AdSense to display advertisements',
          'Google may use cookies to show ads based on your browsing history',
          'You can customize ad preferences at adssettings.google.com',
          'For more information, see Google\'s Privacy Policy'
        ]
      },
      {
        iconKey: 'shield',
        title: 'Data Security',
        items: [
          'Study data is stored locally on your device',
          'We do not sell or share personal information with third parties',
          'Our website uses HTTPS to encrypt data in transit',
          'We do not require registration or account creation'
        ]
      },
      {
        iconKey: 'mail',
        title: 'Your Rights',
        items: [
          'Delete local data by clearing your browser storage',
          'Opt out of cookies via browser settings',
          'Customize Google ads at adssettings.google.com',
          'Contact us if you have questions about your privacy'
        ]
      }
    ],
    contact: 'If you have questions about this privacy policy, please contact us through our Contact page.',
    contactLinkText: 'Contact Page'
  }
};

const iconMap = {
  eye: Eye,
  cookie: Cookie,
  server: Server,
  shield: Shield,
  mail: Mail,
};

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.lastUpdated}</p>
      </div>

      {/* Intro */}
      <Card className="mb-6">
        <p className="text-gray-700 dark:text-gray-300">{t.intro}</p>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {t.sections.map((section, idx) => {
          const IconComponent = iconMap[section.iconKey as keyof typeof iconMap];
          return (
            <Card key={idx}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mt-1" aria-hidden="true">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contact */}
      <Card className="mt-6 bg-gray-50 dark:bg-slate-700/50">
        <p className="text-gray-600 dark:text-gray-300">
          {t.contact}{' '}
          <Link
            href={`/${locale}/contact`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t.contactLinkText}
          </Link>
        </p>
      </Card>
    </div>
  );
}
