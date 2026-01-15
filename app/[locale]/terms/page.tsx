import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, Scale, BookOpen, Ban, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Điều Khoản Sử Dụng - Công Dân Mỹ',
    en: 'Terms of Service - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Điều khoản sử dụng ứng dụng Công Dân Mỹ. Tìm hiểu về quyền và trách nhiệm khi sử dụng trang web.',
    en: 'Terms of service for U.S. Citizenship app. Learn about your rights and responsibilities when using the website.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Điều Khoản Sử Dụng',
    lastUpdated: 'Cập nhật lần cuối: Tháng 1, 2026',
    back: 'Trang chủ',
    intro: 'Chào mừng bạn đến với Công Dân Mỹ. Bằng việc sử dụng trang web của chúng tôi, bạn đồng ý với các điều khoản sau đây.',
    sections: [
      {
        iconKey: 'bookOpen',
        title: 'Mục Đích Sử Dụng',
        items: [
          'Trang web này cung cấp tài liệu học tập cho bài thi quốc tịch Mỹ',
          'Nội dung chỉ dành cho mục đích giáo dục và tham khảo',
          'Đây không phải trang web chính thức của chính phủ Hoa Kỳ',
          'Chúng tôi không liên kết với USCIS hoặc bất kỳ cơ quan chính phủ nào'
        ]
      },
      {
        iconKey: 'alertTriangle',
        title: 'Miễn Trừ Trách Nhiệm',
        items: [
          'Thông tin có thể thay đổi theo chính sách của USCIS',
          'Chúng tôi không đảm bảo độ chính xác 100% của thông tin',
          'Vui lòng xác minh thông tin mới nhất tại uscis.gov',
          'Chúng tôi không chịu trách nhiệm cho kết quả phỏng vấn của bạn'
        ]
      },
      {
        iconKey: 'scale',
        title: 'Quyền Sở Hữu Trí Tuệ',
        items: [
          'Nội dung trang web thuộc bản quyền của Công Dân Mỹ',
          'Câu hỏi thi quốc tịch là tài liệu công cộng của USCIS',
          'Bạn không được sao chép hoặc phân phối nội dung vì mục đích thương mại',
          'Cho phép sử dụng cá nhân cho mục đích học tập'
        ]
      },
      {
        iconKey: 'ban',
        title: 'Hành Vi Bị Cấm',
        items: [
          'Sử dụng trang web cho mục đích bất hợp pháp',
          'Cố gắng xâm nhập hoặc phá hoại hệ thống',
          'Sao chép nội dung để bán hoặc phân phối thương mại',
          'Sử dụng bot hoặc công cụ tự động để thu thập dữ liệu'
        ]
      },
      {
        iconKey: 'refreshCw',
        title: 'Thay Đổi Điều Khoản',
        items: [
          'Chúng tôi có quyền cập nhật điều khoản bất cứ lúc nào',
          'Thay đổi sẽ được đăng tải trên trang này',
          'Tiếp tục sử dụng trang web đồng nghĩa với chấp nhận điều khoản mới',
          'Vui lòng kiểm tra định kỳ để cập nhật thông tin'
        ]
      }
    ],
    contact: 'Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ chúng tôi.',
    contactLinkText: 'Trang Liên Hệ'
  },
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: January 2026',
    back: 'Home',
    intro: 'Welcome to U.S. Citizenship. By using our website, you agree to the following terms.',
    sections: [
      {
        iconKey: 'bookOpen',
        title: 'Purpose of Use',
        items: [
          'This website provides study materials for the U.S. citizenship test',
          'Content is for educational and reference purposes only',
          'This is not an official U.S. government website',
          'We are not affiliated with USCIS or any government agency'
        ]
      },
      {
        iconKey: 'alertTriangle',
        title: 'Disclaimer',
        items: [
          'Information may change according to USCIS policies',
          'We do not guarantee 100% accuracy of information',
          'Please verify the latest information at uscis.gov',
          'We are not responsible for your interview results'
        ]
      },
      {
        iconKey: 'scale',
        title: 'Intellectual Property',
        items: [
          'Website content is copyrighted by U.S. Citizenship',
          'Citizenship test questions are public domain materials from USCIS',
          'You may not copy or distribute content for commercial purposes',
          'Personal use for study purposes is permitted'
        ]
      },
      {
        iconKey: 'ban',
        title: 'Prohibited Activities',
        items: [
          'Using the website for illegal purposes',
          'Attempting to hack or damage the system',
          'Copying content for sale or commercial distribution',
          'Using bots or automated tools to scrape data'
        ]
      },
      {
        iconKey: 'refreshCw',
        title: 'Changes to Terms',
        items: [
          'We reserve the right to update terms at any time',
          'Changes will be posted on this page',
          'Continued use of the website means accepting new terms',
          'Please check periodically for updates'
        ]
      }
    ],
    contact: 'If you have questions about these terms of service, please contact us.',
    contactLinkText: 'Contact Page'
  }
};

const iconMap = {
  bookOpen: BookOpen,
  alertTriangle: AlertTriangle,
  scale: Scale,
  ban: Ban,
  refreshCw: RefreshCw,
};

export default async function TermsOfServicePage({ params }: TermsPageProps) {
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
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
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
