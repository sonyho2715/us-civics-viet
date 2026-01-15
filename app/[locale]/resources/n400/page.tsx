import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle2, Clock, DollarSign, Info, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface N400PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: N400PageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Hướng Dẫn Đơn N-400 - Công Dân Mỹ',
    en: 'N-400 Form Guide - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Hướng dẫn chi tiết điền đơn N-400 xin nhập quốc tịch Mỹ. Giải thích từng phần bằng tiếng Việt.',
    en: 'Detailed guide for completing the N-400 naturalization application. Step-by-step explanations.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Hướng Dẫn Đơn N-400',
    subtitle: 'Đơn xin nhập quốc tịch Mỹ',
    back: 'Trang chủ',
    overview: {
      title: 'Tổng Quan',
      description: 'Đơn N-400 (Application for Naturalization) là đơn chính thức để xin nhập quốc tịch Mỹ. Đơn này có 18 phần và khoảng 20 trang.',
      fee: '$760',
      feeNote: '(Lệ phí có thể miễn cho người thu nhập thấp)',
      processingTime: '8-14 tháng',
      processingNote: 'Thời gian xử lý trung bình',
    },
    sections: [
      {
        number: 'Part 1',
        title: 'Eligibility (Điều Kiện)',
        description: 'Chọn lý do bạn đủ điều kiện nhập tịch',
        tips: [
          'Đa số chọn: "I have been a permanent resident for at least 5 years"',
          'Nếu kết hôn với công dân Mỹ ≥3 năm, chọn option đó',
          'Quân nhân có option riêng',
        ],
      },
      {
        number: 'Part 2',
        title: 'Information About You (Thông Tin Cá Nhân)',
        description: 'Thông tin cơ bản về bản thân',
        tips: [
          'Tên phải CHÍNH XÁC như trên thẻ xanh',
          'Social Security Number - bắt buộc nếu có',
          'A-Number là số 9 chữ số trên thẻ xanh',
          'Date of Birth theo format: MM/DD/YYYY',
        ],
      },
      {
        number: 'Part 3',
        title: 'Accommodation (Hỗ Trợ Đặc Biệt)',
        description: 'Nếu cần hỗ trợ do khuyết tật',
        tips: [
          'Yêu cầu phiên dịch (nếu cần)',
          'Yêu cầu người ký thay (nếu không thể viết)',
          'Đa số để trống phần này',
        ],
      },
      {
        number: 'Part 4',
        title: 'Contact Information (Liên Lạc)',
        description: 'Địa chỉ, số điện thoại, email',
        tips: [
          'Địa chỉ nhận thư phải là nơi bạn THỰC SỰ nhận được thư',
          'Cung cấp số điện thoại di động để nhận tin nhắn từ USCIS',
          'Email giúp nhận thông báo nhanh hơn',
        ],
      },
      {
        number: 'Part 5',
        title: 'Information About Your Parents (Cha Mẹ)',
        description: 'Thông tin về cha mẹ ruột',
        tips: [
          'Nếu cha/mẹ là công dân Mỹ, bạn có thể đã là công dân!',
          'Ghi thông tin như trong giấy khai sinh',
          'Nếu không biết, ghi "Unknown"',
        ],
      },
      {
        number: 'Part 6',
        title: 'Biographic Information (Đặc Điểm Nhận Dạng)',
        description: 'Chiều cao, cân nặng, màu mắt, tóc',
        tips: [
          'Chiều cao: Ghi theo feet và inches',
          'Ví dụ: 5\'6" = 5 feet 6 inches',
          'Màu tóc, mắt: chọn từ danh sách có sẵn',
        ],
      },
      {
        number: 'Part 7-8',
        title: 'Residence & Employment History (Lịch Sử Cư Trú & Việc Làm)',
        description: 'Nơi ở và việc làm trong 5 năm qua',
        tips: [
          'Liệt kê TẤT CẢ địa chỉ trong 5 năm, kể cả ngắn hạn',
          'Không được có "khoảng trống" thời gian',
          'Việc làm bao gồm cả thất nghiệp, nội trợ',
        ],
      },
      {
        number: 'Part 9',
        title: 'Time Outside the U.S. (Thời Gian Ra Nước Ngoài)',
        description: 'Các chuyến đi ra khỏi Mỹ',
        tips: [
          'Liệt kê TẤT CẢ chuyến đi kể cả ngắn',
          'Ở nước ngoài >6 tháng liên tục có thể ảnh hưởng đơn',
          'Ở nước ngoài >1 năm có thể mất quy chế thường trú',
        ],
      },
      {
        number: 'Part 10-11',
        title: 'Marital & Children History (Hôn Nhân & Con Cái)',
        description: 'Lịch sử hôn nhân và thông tin con cái',
        tips: [
          'Liệt kê TẤT CẢ các cuộc hôn nhân (kể cả đã ly dị)',
          'Liệt kê TẤT CẢ con cái (kể cả ở nước ngoài)',
          'Con riêng, con nuôi đều phải khai',
        ],
      },
      {
        number: 'Part 12',
        title: 'Additional Information (Thông Tin Bổ Sung)',
        description: 'Các câu hỏi Yes/No quan trọng',
        tips: [
          'TRẢ LỜI THÀNH THẬT mọi câu hỏi',
          'Bao gồm: tiền án, thuế, membership tổ chức',
          'Nói dối có thể bị từ chối vĩnh viễn',
          'Nếu không chắc, tham khảo luật sư',
        ],
      },
    ],
    importantNotes: {
      title: 'Lưu Ý Quan Trọng',
      notes: [
        {
          type: 'warning',
          text: 'KHÔNG nói dối hoặc giấu thông tin. USCIS có thể kiểm tra và từ chối đơn vĩnh viễn.',
        },
        {
          type: 'info',
          text: 'Giữ bản sao tất cả giấy tờ đã nộp. Bạn sẽ cần mang theo bản gốc khi phỏng vấn.',
        },
        {
          type: 'tip',
          text: 'Nếu có vấn đề phức tạp (tiền án, thuế nợ, hôn nhân phức tạp), nên tham khảo luật sư di trú.',
        },
      ],
    },
    documents: {
      title: 'Giấy Tờ Cần Chuẩn Bị',
      items: [
        'Thẻ xanh (Green Card) bản gốc',
        '2 ảnh hộ chiếu (2x2 inches)',
        'Bản sao thuế IRS 5 năm gần nhất',
        'Giấy kết hôn / ly hôn (nếu có)',
        'Giấy khai sinh con cái',
        'Chứng từ thay đổi tên (nếu có)',
        'Selective Service registration (nam 18-26 tuổi)',
      ],
    },
    resources: {
      title: 'Tài Liệu Tham Khảo',
      links: [
        {
          label: 'Tải đơn N-400 (PDF)',
          url: 'https://www.uscis.gov/n-400',
        },
        {
          label: 'Hướng dẫn chính thức USCIS',
          url: 'https://www.uscis.gov/citizenship/learn-about-citizenship/the-naturalization-interview-and-test',
        },
        {
          label: 'Kiểm tra phí miễn giảm',
          url: 'https://www.uscis.gov/i-912',
        },
      ],
    },
  },
  en: {
    title: 'N-400 Form Guide',
    subtitle: 'Application for Naturalization',
    back: 'Home',
    overview: {
      title: 'Overview',
      description: 'Form N-400 (Application for Naturalization) is the official application to become a U.S. citizen. The form has 18 parts and approximately 20 pages.',
      fee: '$760',
      feeNote: '(Fee waiver available for low-income applicants)',
      processingTime: '8-14 months',
      processingNote: 'Average processing time',
    },
    sections: [
      {
        number: 'Part 1',
        title: 'Eligibility',
        description: 'Select your basis for eligibility',
        tips: [
          'Most select: "I have been a permanent resident for at least 5 years"',
          'If married to U.S. citizen ≥3 years, select that option',
          'Military members have separate options',
        ],
      },
      {
        number: 'Part 2',
        title: 'Information About You',
        description: 'Basic personal information',
        tips: [
          'Name must EXACTLY match your green card',
          'Social Security Number - required if you have one',
          'A-Number is the 9-digit number on your green card',
          'Date of Birth format: MM/DD/YYYY',
        ],
      },
      {
        number: 'Part 3',
        title: 'Accommodation',
        description: 'If you need special accommodations due to disability',
        tips: [
          'Request interpreter (if needed)',
          'Request someone to sign on your behalf (if unable to write)',
          'Most people leave this section blank',
        ],
      },
      {
        number: 'Part 4',
        title: 'Contact Information',
        description: 'Address, phone number, email',
        tips: [
          'Mailing address must be where you ACTUALLY receive mail',
          'Provide mobile phone to receive USCIS text notifications',
          'Email helps receive notifications faster',
        ],
      },
      {
        number: 'Part 5',
        title: 'Information About Your Parents',
        description: 'Information about biological parents',
        tips: [
          'If parent is a U.S. citizen, you may already be a citizen!',
          'Enter information as shown on birth certificate',
          'If unknown, write "Unknown"',
        ],
      },
      {
        number: 'Part 6',
        title: 'Biographic Information',
        description: 'Height, weight, eye color, hair color',
        tips: [
          'Height: Enter in feet and inches',
          'Example: 5\'6" = 5 feet 6 inches',
          'Hair and eye color: choose from provided list',
        ],
      },
      {
        number: 'Part 7-8',
        title: 'Residence & Employment History',
        description: 'Where you lived and worked in the past 5 years',
        tips: [
          'List ALL addresses in past 5 years, even short stays',
          'No "gaps" in timeline allowed',
          'Employment includes unemployment, homemaker',
        ],
      },
      {
        number: 'Part 9',
        title: 'Time Outside the U.S.',
        description: 'All trips outside the United States',
        tips: [
          'List ALL trips, even short ones',
          'Trips >6 months continuous may affect application',
          'Trips >1 year may break residency requirement',
        ],
      },
      {
        number: 'Part 10-11',
        title: 'Marital & Children History',
        description: 'Marriage history and children information',
        tips: [
          'List ALL marriages (including divorces)',
          'List ALL children (including those abroad)',
          'Stepchildren and adopted children must be listed',
        ],
      },
      {
        number: 'Part 12',
        title: 'Additional Information',
        description: 'Important Yes/No questions',
        tips: [
          'ANSWER HONESTLY on all questions',
          'Includes: criminal history, taxes, organization memberships',
          'Lying can result in permanent denial',
          'If unsure, consult an immigration attorney',
        ],
      },
    ],
    importantNotes: {
      title: 'Important Notes',
      notes: [
        {
          type: 'warning',
          text: 'DO NOT lie or hide information. USCIS can verify and permanently deny your application.',
        },
        {
          type: 'info',
          text: 'Keep copies of all submitted documents. You will need to bring originals to your interview.',
        },
        {
          type: 'tip',
          text: 'For complex issues (criminal history, tax debts, complicated marriages), consult an immigration attorney.',
        },
      ],
    },
    documents: {
      title: 'Required Documents',
      items: [
        'Original Green Card',
        '2 passport photos (2x2 inches)',
        'IRS tax returns for past 5 years',
        'Marriage/divorce certificates (if applicable)',
        'Children\'s birth certificates',
        'Name change documents (if applicable)',
        'Selective Service registration (males 18-26)',
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        {
          label: 'Download N-400 Form (PDF)',
          url: 'https://www.uscis.gov/n-400',
        },
        {
          label: 'Official USCIS Instructions',
          url: 'https://www.uscis.gov/citizenship/learn-about-citizenship/the-naturalization-interview-and-test',
        },
        {
          label: 'Check Fee Waiver Eligibility',
          url: 'https://www.uscis.gov/i-912',
        },
      ],
    },
  },
};

export default async function N400GuidePage({ params }: N400PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = content[locale as Locale] || content.vi;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition-colors"
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
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.overview.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {t.overview.description}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{t.overview.fee}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t.overview.feeNote}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{t.overview.processingTime}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t.overview.processingNote}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <div className="space-y-3 mb-8">
        {t.importantNotes.notes.map((note, idx) => (
          <Card
            key={idx}
            className={`flex items-start gap-3 ${
              note.type === 'warning'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : note.type === 'info'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}
          >
            {note.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : note.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <p className={`text-sm ${
              note.type === 'warning'
                ? 'text-red-800 dark:text-red-300'
                : note.type === 'info'
                  ? 'text-blue-800 dark:text-blue-300'
                  : 'text-green-800 dark:text-green-300'
            }`}>
              {note.text}
            </p>
          </Card>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {locale === 'vi' ? 'Các Phần Trong Đơn' : 'Form Sections'}
        </h2>
        {t.sections.map((section, idx) => (
          <Card key={idx}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {section.number.replace('Part ', '')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {section.description}
                </p>
                <ul className="space-y-1">
                  {section.tips.map((tip, tipIdx) => (
                    <li key={tipIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-blue-500 mt-0.5" aria-hidden="true">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Documents */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.documents.title}
        </h2>
        <ul className="grid md:grid-cols-2 gap-2">
          {t.documents.items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Resources */}
      <Card className="bg-gray-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.resources.title}
        </h2>
        <div className="space-y-2">
          {t.resources.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
