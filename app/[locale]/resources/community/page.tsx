import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Heart,
  Share2,
  ExternalLink,
  Mail,
  Facebook,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Trophy,
  Clock,
  MapPin,
  Phone,
  Building2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface CommunityPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Cộng Đồng Người Việt - Công Dân Mỹ',
    en: 'Vietnamese Community - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Kết nối với cộng đồng người Việt đang chuẩn bị thi quốc tịch Mỹ. Chia sẻ kinh nghiệm, hỏi đáp, và hỗ trợ lẫn nhau.',
    en: 'Connect with the Vietnamese community preparing for U.S. citizenship. Share experiences, ask questions, and support each other.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Cộng Đồng Người Việt',
    subtitle: 'Kết nối, chia sẻ và hỗ trợ nhau trên con đường trở thành công dân Mỹ',
    back: 'Trang chủ',

    stats: {
      items: [
        { value: '10,000+', label: 'Người Việt đậu mỗi năm' },
        { value: '91%', label: 'Tỷ lệ đậu lần đầu' },
        { value: '50+', label: 'Tiểu bang có cộng đồng' },
      ],
    },

    discussionTopics: {
      title: 'Chủ Đề Thảo Luận',
      topics: [
        {
          icon: 'helpcircle',
          title: 'Hỏi Đáp Chung',
          description: 'Câu hỏi về quy trình, yêu cầu, và thủ tục nhập tịch',
          count: 156,
          color: 'blue',
        },
        {
          icon: 'lightbulb',
          title: 'Mẹo Học Thi',
          description: 'Chia sẻ phương pháp học và ghi nhớ hiệu quả',
          count: 89,
          color: 'amber',
        },
        {
          icon: 'trophy',
          title: 'Kinh Nghiệm Phỏng Vấn',
          description: 'Câu chuyện từ những người đã thi đậu',
          count: 234,
          color: 'green',
        },
        {
          icon: 'bookopen',
          title: 'Tài Liệu Học Tập',
          description: 'Chia sẻ tài liệu, video, và nguồn học miễn phí',
          count: 67,
          color: 'purple',
        },
      ],
    },

    recentQuestions: {
      title: 'Câu Hỏi Thường Gặp',
      questions: [
        {
          question: 'Tôi 67 tuổi, ở Mỹ 22 năm. Tôi thi theo chương trình nào?',
          answer: 'Bạn đủ điều kiện chương trình 65/20. Chỉ cần học 20 câu và thi bằng tiếng Việt với thông dịch viên.',
          author: 'Cô Mai, San Jose',
          time: '2 ngày trước',
        },
        {
          question: 'Phải đợi bao lâu sau khi nộp N-400?',
          answer: 'Trung bình 8-14 tháng từ lúc nộp đơn đến phỏng vấn. Có thể theo dõi trên USCIS Case Status.',
          author: 'Anh Tuấn, Houston',
          time: '3 ngày trước',
        },
        {
          question: 'Nếu trượt bài thi, có được thi lại không?',
          answer: 'Có, bạn được thi lại một lần trong vòng 60-90 ngày. Chỉ thi lại phần trượt (tiếng Anh hoặc công dân).',
          author: 'Chị Hương, Westminster',
          time: '5 ngày trước',
        },
        {
          question: 'Tiếng Anh tôi không giỏi. Có cách nào không?',
          answer: 'USCIS hiểu tiếng Anh của bạn không hoàn hảo. Nói chậm, rõ ràng. Có thể xin nhắc lại câu hỏi nếu không hiểu.',
          author: 'Cô Lan, San Diego',
          time: '1 tuần trước',
        },
      ],
    },

    communityResources: {
      title: 'Nguồn Hỗ Trợ Cộng Đồng',
      description: 'Kết nối với các tổ chức và nhóm hỗ trợ người Việt',
      resources: [
        {
          name: 'Boat People SOS (BPSOS)',
          description: 'Tổ chức phi lợi nhuận hỗ trợ người Việt tị nạn và nhập cư. Có văn phòng tại CA, TX, VA với dịch vụ tư vấn miễn phí.',
          url: 'https://www.bpsos.org',
          type: 'Tổ chức',
          location: 'CA, TX, VA',
        },
        {
          name: 'USCIS - Tài Liệu Chính Thức',
          description: 'Website chính thức với tài liệu học thi, đơn N-400, và thông tin mới nhất về quy trình nhập tịch.',
          url: 'https://www.uscis.gov/citizenship',
          type: 'Chính phủ',
          location: 'Toàn quốc',
        },
        {
          name: 'Catholic Charities',
          description: 'Dịch vụ di trú và nhập tịch miễn phí hoặc giá thấp. Hỗ trợ điền đơn N-400 và chuẩn bị phỏng vấn.',
          url: 'https://www.catholiccharitiesusa.org',
          type: 'Tổ chức',
          location: 'Toàn quốc',
        },
        {
          name: 'Asian Americans Advancing Justice',
          description: 'Tổ chức bảo vệ quyền lợi người Á châu với dịch vụ pháp lý di trú miễn phí.',
          url: 'https://www.advancingjustice-aajc.org',
          type: 'Tổ chức',
          location: 'CA, DC',
        },
        {
          name: 'USCIS - Tìm Lớp Học Gần Bạn',
          description: 'Công cụ tìm kiếm các lớp học công dân và tiếng Anh miễn phí trong khu vực của bạn.',
          url: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources/find-a-prep-class',
          type: 'Chính phủ',
          location: 'Toàn quốc',
        },
        {
          name: 'ImmigraHelpline (Línea de Ayuda)',
          description: 'Đường dây nóng miễn phí để hỏi về di trú và nhập tịch. Có phiên dịch viên.',
          url: 'tel:1-800-375-5283',
          type: 'Dịch vụ',
          location: '1-800-375-5283',
        },
        {
          name: 'Vietnamese Community Center (San Jose)',
          description: 'Lớp học quốc tịch miễn phí bằng tiếng Việt. Thứ Bảy hàng tuần.',
          url: 'https://www.vcc-sj.org',
          type: 'Trung tâm',
          location: 'San Jose, CA',
        },
        {
          name: 'VietAID (Boston)',
          description: 'Dịch vụ cộng đồng cho người Việt tại vùng Boston, bao gồm hỗ trợ nhập tịch.',
          url: 'https://www.vietaid.org',
          type: 'Tổ chức',
          location: 'Boston, MA',
        },
        {
          name: 'UNAVSA - Citizenship Resources',
          description: 'Liên minh sinh viên Việt Mỹ với nguồn tài liệu và tình nguyện viên hỗ trợ nhập tịch.',
          url: 'https://www.unavsa.org',
          type: 'Tổ chức',
          location: 'Toàn quốc',
        },
        {
          name: 'Trung Tâm Cộng Đồng Người Việt (Houston)',
          description: 'Lớp học quốc tịch, dịch vụ phiên dịch, và hỗ trợ cộng đồng người Việt tại Houston.',
          url: 'https://www.viet-hou.org',
          type: 'Trung tâm',
          location: 'Houston, TX',
        },
      ],
    },

    localCommunities: {
      title: 'Cộng Đồng Theo Địa Phương',
      description: 'Tìm nhóm hỗ trợ gần bạn',
      locations: [
        { name: 'California', cities: ['San Jose', 'Westminster', 'San Diego', 'Los Angeles'], count: '200K+' },
        { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin'], count: '100K+' },
        { name: 'Washington', cities: ['Seattle', 'Tacoma'], count: '50K+' },
        { name: 'Virginia', cities: ['Falls Church', 'Arlington'], count: '40K+' },
        { name: 'Florida', cities: ['Orlando', 'Tampa', 'Miami'], count: '35K+' },
        { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge'], count: '30K+' },
      ],
    },

    uscisOffices: {
      title: 'Văn Phòng USCIS Phục Vụ Cộng Đồng Người Việt',
      description: 'Địa chỉ văn phòng USCIS chính ở các thành phố có đông người Việt',
      offices: [
        {
          city: 'San Jose, CA',
          address: '1887 Monterey Rd, San Jose, CA 95112',
          phone: '1-800-375-5283',
          services: 'Phỏng vấn quốc tịch, sinh trắc học, dịch vụ nhập cư',
        },
        {
          city: 'Los Angeles, CA',
          address: '300 N Los Angeles St, Los Angeles, CA 90012',
          phone: '1-800-375-5283',
          services: 'Phỏng vấn quốc tịch, sinh trắc học, dịch vụ nhập cư',
        },
        {
          city: 'Houston, TX',
          address: '126 Northpoint Dr, Houston, TX 77060',
          phone: '1-800-375-5283',
          services: 'Phỏng vấn quốc tịch, sinh trắc học, dịch vụ nhập cư',
        },
        {
          city: 'Seattle, WA',
          address: '12500 Tukwila International Blvd, Seattle, WA 98168',
          phone: '1-800-375-5283',
          services: 'Phỏng vấn quốc tịch, sinh trắc học, dịch vụ nhập cư',
        },
        {
          city: 'New Orleans, LA',
          address: '701 Loyola Ave, Suite 1501, New Orleans, LA 70113',
          phone: '1-800-375-5283',
          services: 'Phỏng vấn quốc tịch, sinh trắc học, dịch vụ nhập cư',
        },
        {
          city: 'Boston, MA',
          address: 'John F. Kennedy Federal Building, 15 New Sudbury St, Boston, MA 02203',
          phone: '1-800-375-5283',
          services: 'Phỏng vấn quốc tịch, sinh trắc học, dịch vụ nhập cư',
        },
      ],
      note: 'Lưu ý: Luôn đặt lịch hẹn trước. Không nhận khách không hẹn. Số điện thoại là đường dây USCIS toàn quốc.',
    },

    shareStory: {
      title: 'Chia Sẻ Câu Chuyện Của Bạn',
      description: 'Bạn đã thi đậu quốc tịch? Hãy chia sẻ kinh nghiệm để giúp đỡ cộng đồng!',
      benefits: [
        'Giúp người khác bớt lo lắng',
        'Chia sẻ mẹo học hữu ích',
        'Xây dựng cộng đồng mạnh mẽ',
      ],
      cta: 'Gửi Câu Chuyện',
      email: 'stories@congdanmy.com',
    },

    volunteer: {
      title: 'Tình Nguyện Viên',
      description: 'Bạn muốn giúp đỡ cộng đồng? Chúng tôi cần:',
      roles: [
        'Người hướng dẫn học thi',
        'Thông dịch viên',
        'Người chia sẻ kinh nghiệm',
        'Người đóng góp nội dung',
      ],
      cta: 'Đăng Ký Tình Nguyện',
    },

    upcomingEvents: {
      title: 'Sự Kiện Sắp Tới',
      events: [
        {
          name: 'Lớp Học Thi Quốc Tịch Online',
          date: 'Mỗi thứ Bảy, 10:00 AM PST',
          location: 'Zoom',
          type: 'Miễn phí',
        },
        {
          name: 'Hội Thảo N-400',
          date: 'Ngày 25 hàng tháng',
          location: 'BPSOS Houston',
          type: 'Miễn phí',
        },
      ],
    },
  },
  en: {
    title: 'Vietnamese Community',
    subtitle: 'Connect, share and support each other on the path to becoming U.S. citizens',
    back: 'Home',

    stats: {
      items: [
        { value: '10,000+', label: 'Vietnamese naturalized yearly' },
        { value: '91%', label: 'First-time pass rate' },
        { value: '50+', label: 'States with communities' },
      ],
    },

    discussionTopics: {
      title: 'Discussion Topics',
      topics: [
        {
          icon: 'helpcircle',
          title: 'General Q&A',
          description: 'Questions about process, requirements, and naturalization procedures',
          count: 156,
          color: 'blue',
        },
        {
          icon: 'lightbulb',
          title: 'Study Tips',
          description: 'Share effective study and memorization methods',
          count: 89,
          color: 'amber',
        },
        {
          icon: 'trophy',
          title: 'Interview Experiences',
          description: 'Stories from those who have passed',
          count: 234,
          color: 'green',
        },
        {
          icon: 'bookopen',
          title: 'Study Materials',
          description: 'Share materials, videos, and free learning resources',
          count: 67,
          color: 'purple',
        },
      ],
    },

    recentQuestions: {
      title: 'Frequently Asked Questions',
      questions: [
        {
          question: "I'm 67 years old, lived in the US for 22 years. Which program do I qualify for?",
          answer: 'You qualify for the 65/20 program. You only need to study 20 questions and can take the test in Vietnamese with an interpreter.',
          author: 'Mrs. Mai, San Jose',
          time: '2 days ago',
        },
        {
          question: 'How long to wait after submitting N-400?',
          answer: 'Average 8-14 months from submission to interview. You can track on USCIS Case Status.',
          author: 'Mr. Tuan, Houston',
          time: '3 days ago',
        },
        {
          question: 'If I fail the test, can I retake it?',
          answer: 'Yes, you can retake once within 60-90 days. You only retake the failed portion (English or civics).',
          author: 'Ms. Huong, Westminster',
          time: '5 days ago',
        },
        {
          question: "My English isn't good. Is there a way?",
          answer: "USCIS understands your English isn't perfect. Speak slowly and clearly. You can ask them to repeat questions if you don't understand.",
          author: 'Mrs. Lan, San Diego',
          time: '1 week ago',
        },
      ],
    },

    communityResources: {
      title: 'Community Resources',
      description: 'Connect with organizations and groups supporting Vietnamese',
      resources: [
        {
          name: 'Boat People SOS (BPSOS)',
          description: 'Non-profit organization supporting Vietnamese refugees and immigrants. Offices in CA, TX, VA with free consultation services.',
          url: 'https://www.bpsos.org',
          type: 'Organization',
          location: 'CA, TX, VA',
        },
        {
          name: 'USCIS - Official Resources',
          description: 'Official website with study materials, N-400 form, and latest information on naturalization process.',
          url: 'https://www.uscis.gov/citizenship',
          type: 'Government',
          location: 'Nationwide',
        },
        {
          name: 'Catholic Charities',
          description: 'Free or low-cost immigration and citizenship services. Helps with N-400 form and interview preparation.',
          url: 'https://www.catholiccharitiesusa.org',
          type: 'Organization',
          location: 'Nationwide',
        },
        {
          name: 'Asian Americans Advancing Justice',
          description: 'Asian American civil rights organization with free immigration legal services.',
          url: 'https://www.advancingjustice-aajc.org',
          type: 'Organization',
          location: 'CA, DC',
        },
        {
          name: 'USCIS - Find a Prep Class',
          description: 'Tool to find free citizenship and English classes in your area.',
          url: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources/find-a-prep-class',
          type: 'Government',
          location: 'Nationwide',
        },
        {
          name: 'ImmigraHelpline (Línea de Ayuda)',
          description: 'Free helpline for immigration and citizenship questions. Interpreters available.',
          url: 'tel:1-800-375-5283',
          type: 'Service',
          location: '1-800-375-5283',
        },
        {
          name: 'Vietnamese Community Center (San Jose)',
          description: 'Free citizenship classes in Vietnamese. Every Saturday.',
          url: 'https://www.vcc-sj.org',
          type: 'Center',
          location: 'San Jose, CA',
        },
        {
          name: 'VietAID (Boston)',
          description: 'Community services for Vietnamese in Boston area, including citizenship support.',
          url: 'https://www.vietaid.org',
          type: 'Organization',
          location: 'Boston, MA',
        },
        {
          name: 'UNAVSA - Citizenship Resources',
          description: 'Union of North American Vietnamese Student Associations with resources and volunteers supporting citizenship.',
          url: 'https://www.unavsa.org',
          type: 'Organization',
          location: 'Nationwide',
        },
        {
          name: 'Vietnamese Community Center (Houston)',
          description: 'Citizenship classes, interpretation services, and community support for Vietnamese in Houston.',
          url: 'https://www.viet-hou.org',
          type: 'Center',
          location: 'Houston, TX',
        },
      ],
    },

    localCommunities: {
      title: 'Local Communities',
      description: 'Find support groups near you',
      locations: [
        { name: 'California', cities: ['San Jose', 'Westminster', 'San Diego', 'Los Angeles'], count: '200K+' },
        { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin'], count: '100K+' },
        { name: 'Washington', cities: ['Seattle', 'Tacoma'], count: '50K+' },
        { name: 'Virginia', cities: ['Falls Church', 'Arlington'], count: '40K+' },
        { name: 'Florida', cities: ['Orlando', 'Tampa', 'Miami'], count: '35K+' },
        { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge'], count: '30K+' },
      ],
    },

    uscisOffices: {
      title: 'USCIS Offices Serving Vietnamese Communities',
      description: 'Main USCIS office addresses in cities with large Vietnamese populations',
      offices: [
        {
          city: 'San Jose, CA',
          address: '1887 Monterey Rd, San Jose, CA 95112',
          phone: '1-800-375-5283',
          services: 'Citizenship interviews, biometrics, immigration services',
        },
        {
          city: 'Los Angeles, CA',
          address: '300 N Los Angeles St, Los Angeles, CA 90012',
          phone: '1-800-375-5283',
          services: 'Citizenship interviews, biometrics, immigration services',
        },
        {
          city: 'Houston, TX',
          address: '126 Northpoint Dr, Houston, TX 77060',
          phone: '1-800-375-5283',
          services: 'Citizenship interviews, biometrics, immigration services',
        },
        {
          city: 'Seattle, WA',
          address: '12500 Tukwila International Blvd, Seattle, WA 98168',
          phone: '1-800-375-5283',
          services: 'Citizenship interviews, biometrics, immigration services',
        },
        {
          city: 'New Orleans, LA',
          address: '701 Loyola Ave, Suite 1501, New Orleans, LA 70113',
          phone: '1-800-375-5283',
          services: 'Citizenship interviews, biometrics, immigration services',
        },
        {
          city: 'Boston, MA',
          address: 'John F. Kennedy Federal Building, 15 New Sudbury St, Boston, MA 02203',
          phone: '1-800-375-5283',
          services: 'Citizenship interviews, biometrics, immigration services',
        },
      ],
      note: 'Note: Always schedule an appointment in advance. Walk-ins not accepted. Phone number is the nationwide USCIS contact center.',
    },

    shareStory: {
      title: 'Share Your Story',
      description: 'Did you pass your citizenship test? Share your experience to help the community!',
      benefits: [
        'Help others feel less worried',
        'Share useful study tips',
        'Build a stronger community',
      ],
      cta: 'Submit Your Story',
      email: 'stories@congdanmy.com',
    },

    volunteer: {
      title: 'Volunteers',
      description: 'Want to help the community? We need:',
      roles: [
        'Test prep tutors',
        'Interpreters',
        'Experience sharers',
        'Content contributors',
      ],
      cta: 'Sign Up to Volunteer',
    },

    upcomingEvents: {
      title: 'Upcoming Events',
      events: [
        {
          name: 'Online Citizenship Test Class',
          date: 'Every Saturday, 10:00 AM PST',
          location: 'Zoom',
          type: 'Free',
        },
        {
          name: 'N-400 Workshop',
          date: '25th of each month',
          location: 'BPSOS Houston',
          type: 'Free',
        },
      ],
    },
  },
};

const iconMap = {
  helpcircle: HelpCircle,
  lightbulb: Lightbulb,
  trophy: Trophy,
  bookopen: BookOpen,
  users: Users,
  messagecircle: MessageCircle,
  heart: Heart,
  share2: Share2,
  clock: Clock,
  mappin: MapPin,
};

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
};

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = content[locale as Locale] || content.vi;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.back}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="grid grid-cols-3 gap-4">
          {t.stats.items.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Discussion Topics */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.discussionTopics.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.discussionTopics.topics.map((topic, idx) => {
            const IconComponent = iconMap[topic.icon as keyof typeof iconMap];
            const colors = colorMap[topic.color as keyof typeof colorMap];
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${colors.text}`} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {topic.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                      {topic.count}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Questions */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.recentQuestions.title}
        </h2>
        <div className="space-y-4">
          {t.recentQuestions.questions.map((q, idx) => (
            <div key={idx} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {q.question}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {q.answer}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>{q.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {q.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Community Resources */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.communityResources.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.communityResources.description}
        </p>
        <div className="space-y-3">
          {t.communityResources.resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-colors"
            >
              <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                {resource.type === 'Facebook' ? (
                  <Facebook className="w-5 h-5 text-blue-600" aria-hidden="true" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {resource.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded">
                    {resource.type}
                  </span>
                  {resource.location && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {resource.location}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {resource.description}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>
      </Card>

      {/* Local Communities */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.localCommunities.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.localCommunities.description}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {t.localCommunities.locations.map((location, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {location.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                    {location.count}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {location.cities.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* USCIS Offices */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.uscisOffices.title}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.uscisOffices.description}
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {t.uscisOffices.offices.map((office, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {office.city}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {office.address}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Phone className="w-3 h-3" aria-hidden="true" />
                <a href={`tel:${office.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {office.phone}
                </a>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                {office.services}
              </p>
            </div>
          ))}
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            ℹ️ {t.uscisOffices.note}
          </p>
        </div>
      </Card>

      {/* Share Story CTA */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <Heart className="w-10 h-10 text-amber-500 mb-3" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t.shareStory.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {t.shareStory.description}
          </p>
          <ul className="space-y-1 mb-4">
            {t.shareStory.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-amber-500" aria-hidden="true">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${t.shareStory.email}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {t.shareStory.cta}
          </a>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <Users className="w-10 h-10 text-blue-500 mb-3" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t.volunteer.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {t.volunteer.description}
          </p>
          <ul className="space-y-1 mb-4">
            {t.volunteer.roles.map((role, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-blue-500" aria-hidden="true">•</span>
                {role}
              </li>
            ))}
          </ul>
          <a
            href={`mailto:volunteer@congdanmy.com`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {t.volunteer.cta}
          </a>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.upcomingEvents.title}
        </h2>
        <div className="space-y-3">
          {t.upcomingEvents.events.map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-700/50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {event.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>{event.date}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    {event.location}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
