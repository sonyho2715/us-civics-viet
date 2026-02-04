import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, Trophy, Quote, MapPin, Calendar, Star, Heart, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface StoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: StoriesPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Kinh Nghiệm Thi Quốc Tịch - Công Dân Mỹ',
    en: 'Citizenship Success Stories - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Đọc kinh nghiệm thi quốc tịch Mỹ từ cộng đồng người Việt. Mẹo chuẩn bị, kinh nghiệm phỏng vấn, và câu chuyện thành công.',
    en: 'Read U.S. citizenship test experiences from the Vietnamese community. Preparation tips, interview experiences, and success stories.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Kinh Nghiệm Thi Quốc Tịch',
    subtitle: 'Câu chuyện thành công từ cộng đồng người Việt',
    back: 'Trang chủ',
    featuredStories: [
      {
        name: 'Cô Nguyễn Thị Lan',
        age: 68,
        location: 'San Jose, CA',
        date: 'Tháng 11, 2024',
        yearsInUS: 25,
        program: '65/20',
        quote: 'Tôi học mỗi ngày 30 phút trong 2 tháng. Viên chức hỏi 10 câu, tôi trả lời đúng 8 câu. Quan trọng nhất là đừng sợ và nói chậm rãi.',
        tips: [
          'Học thuộc 20 câu 65/20 trước',
          'Tập nói tiếng Anh với con cháu',
          'Mang theo giấy tờ đầy đủ',
          'Đến sớm 30 phút để bình tĩnh',
        ],
      },
      {
        name: 'Anh Trần Văn Minh',
        age: 45,
        location: 'Houston, TX',
        date: 'Tháng 10, 2024',
        yearsInUS: 15,
        program: 'Standard',
        quote: 'Tôi dùng app này học mỗi tối sau khi đi làm về. Bài thi thử giúp tôi quen với format câu hỏi. Ngày thi, viên chức chỉ hỏi 6 câu vì tôi trả lời đúng liên tục.',
        tips: [
          'Làm bài thi thử nhiều lần',
          'Học theo chủ đề sẽ dễ nhớ hơn',
          'Đọc to câu trả lời để quen miệng',
          'Ngủ đủ giấc đêm trước ngày thi',
        ],
      },
      {
        name: 'Chị Phạm Thúy Hằng',
        age: 52,
        location: 'Westminster, CA',
        date: 'Tháng 9, 2024',
        yearsInUS: 18,
        program: 'Standard',
        quote: 'Lúc đầu tôi rất lo lắng vì tiếng Anh không giỏi. Nhưng học song ngữ Việt-Anh giúp tôi hiểu rõ ý nghĩa từng câu hỏi. Viên chức rất thân thiện và kiên nhẫn.',
        tips: [
          'Hiểu ý nghĩa chứ không chỉ học vẹt',
          'Tập viết tên và địa chỉ bằng tiếng Anh',
          'Chuẩn bị câu trả lời cho N-400',
          'Giữ bình tĩnh, viên chức muốn giúp bạn đậu',
        ],
      },
      {
        name: 'Anh Lê Quang Dũng',
        age: 28,
        location: 'Seattle, WA',
        date: 'Tháng 8, 2024',
        yearsInUS: 10,
        program: 'Standard',
        quote: 'Tôi sang Mỹ lúc 18 tuổi theo gia đình. Sau khi lấy được thẻ xanh qua công việc, tôi chờ đủ 5 năm rồi nộp đơn ngay. Học online rất tiện, tôi có thể học bất cứ lúc nào.',
        tips: [
          'Bắt đầu học sớm, không cần đợi đến phút chót',
          'Sử dụng flashcard trên điện thoại',
          'Tham gia nhóm học online để hỏi đáp',
          'Đừng lo nếu bạn trẻ, bài thi giống nhau cho mọi lứa tuổi',
        ],
      },
      {
        name: 'Cô Võ Thị Mai',
        age: 71,
        location: 'New Orleans, LA',
        date: 'Tháng 7, 2024',
        yearsInUS: 30,
        program: '65/20',
        quote: 'Tôi ở Mỹ lâu rồi nhưng chưa bao giờ thi quốc tịch vì sợ. Con cháu động viên nên tôi quyết tâm thử. Tôi học với cô giáo tình nguyện tại chùa. Sau 3 tháng, tôi đậu!',
        tips: [
          'Tìm lớp học miễn phí tại chùa hoặc trung tâm cộng đồng',
          'Học nhóm với bạn bè cùng lứa tuổi',
          'Đừng xấu hổ nếu học chậm, quan trọng là kiên trì',
          'Mang theo kính đọc sách và máy trợ thính nếu cần',
        ],
      },
    ],
    interviewTips: {
      title: 'Mẹo Từ Người Đã Thi Đậu',
      tips: [
        {
          icon: 'calendar',
          title: 'Chuẩn Bị Trước 2-3 Tháng',
          description: 'Học mỗi ngày 20-30 phút hiệu quả hơn nhồi nhét trước ngày thi.',
        },
        {
          icon: 'users',
          title: 'Tập Với Gia Đình',
          description: 'Nhờ con cháu hỏi câu hỏi để quen trả lời bằng tiếng Anh.',
        },
        {
          icon: 'heart',
          title: 'Giữ Tinh Thần Tích Cực',
          description: 'Viên chức USCIS muốn bạn đậu. Họ sẽ cho bạn cơ hội trả lời.',
        },
        {
          icon: 'star',
          title: 'Tự Tin Là Chìa Khóa',
          description: 'Nói chậm, rõ ràng. Không sao nếu cần xin nhắc lại câu hỏi.',
        },
      ],
    },
    stats: {
      title: 'Thống Kê Từ Cộng Đồng',
      items: [
        { value: '91%', label: 'Tỷ lệ đậu lần đầu' },
        { value: '2-3', label: 'Tháng chuẩn bị' },
        { value: '6-10', label: 'Câu hỏi được hỏi' },
        { value: '15-20', label: 'Phút phỏng vấn' },
      ],
    },
    sharePrompt: {
      title: 'Chia Sẻ Kinh Nghiệm Của Bạn',
      description: 'Bạn đã thi đậu quốc tịch? Hãy chia sẻ kinh nghiệm để giúp đỡ cộng đồng!',
      button: 'Gửi Câu Chuyện',
      email: 'Gửi email đến: stories@congdanmy.com',
    },
  },
  en: {
    title: 'Citizenship Success Stories',
    subtitle: 'Success stories from the Vietnamese community',
    back: 'Home',
    featuredStories: [
      {
        name: 'Mrs. Nguyen Thi Lan',
        age: 68,
        location: 'San Jose, CA',
        date: 'November 2024',
        yearsInUS: 25,
        program: '65/20',
        quote: 'I studied 30 minutes every day for 2 months. The officer asked 10 questions, and I answered 8 correctly. The most important thing is to not be afraid and speak slowly.',
        tips: [
          'Learn the 20 questions for 65/20 first',
          'Practice speaking English with family',
          'Bring all required documents',
          'Arrive 30 minutes early to stay calm',
        ],
      },
      {
        name: 'Mr. Tran Van Minh',
        age: 45,
        location: 'Houston, TX',
        date: 'October 2024',
        yearsInUS: 15,
        program: 'Standard',
        quote: 'I used this app to study every night after work. The practice tests helped me get familiar with the question format. On test day, the officer only asked 6 questions because I answered correctly in a row.',
        tips: [
          'Take practice tests multiple times',
          'Studying by topic makes it easier to remember',
          'Read answers out loud to get comfortable',
          'Get enough sleep the night before',
        ],
      },
      {
        name: 'Ms. Pham Thuy Hang',
        age: 52,
        location: 'Westminster, CA',
        date: 'September 2024',
        yearsInUS: 18,
        program: 'Standard',
        quote: 'At first I was worried because my English isn\'t great. But learning bilingually in Vietnamese and English helped me understand the meaning of each question. The officer was very friendly and patient.',
        tips: [
          'Understand the meaning, not just memorize',
          'Practice writing your name and address in English',
          'Prepare answers for N-400 questions',
          'Stay calm, the officer wants to help you pass',
        ],
      },
      {
        name: 'Mr. Le Quang Dung',
        age: 28,
        location: 'Seattle, WA',
        date: 'August 2024',
        yearsInUS: 10,
        program: 'Standard',
        quote: 'I came to the U.S. at 18 with my family. After getting my green card through work, I waited exactly 5 years then applied right away. Online studying is so convenient, I could study anytime.',
        tips: [
          'Start studying early, don\'t wait until the last minute',
          'Use flashcards on your phone',
          'Join online study groups to ask questions',
          'Don\'t worry if you\'re young, the test is the same for all ages',
        ],
      },
      {
        name: 'Mrs. Vo Thi Mai',
        age: 71,
        location: 'New Orleans, LA',
        date: 'July 2024',
        yearsInUS: 30,
        program: '65/20',
        quote: 'I\'ve been in the U.S. for a long time but never took the citizenship test because I was scared. My children encouraged me, so I decided to try. I studied with a volunteer teacher at the temple. After 3 months, I passed!',
        tips: [
          'Find free classes at temples or community centers',
          'Study in groups with friends your age',
          'Don\'t be embarrassed if you learn slowly, persistence is key',
          'Bring reading glasses and hearing aids if needed',
        ],
      },
    ],
    interviewTips: {
      title: 'Tips From Those Who Passed',
      tips: [
        {
          icon: 'calendar',
          title: 'Prepare 2-3 Months Ahead',
          description: 'Studying 20-30 minutes daily is more effective than cramming before the test.',
        },
        {
          icon: 'users',
          title: 'Practice With Family',
          description: 'Ask family members to quiz you to get comfortable answering in English.',
        },
        {
          icon: 'heart',
          title: 'Stay Positive',
          description: 'USCIS officers want you to pass. They will give you chances to answer.',
        },
        {
          icon: 'star',
          title: 'Confidence Is Key',
          description: 'Speak slowly and clearly. It\'s okay to ask them to repeat the question.',
        },
      ],
    },
    stats: {
      title: 'Community Statistics',
      items: [
        { value: '91%', label: 'First-time pass rate' },
        { value: '2-3', label: 'Months of preparation' },
        { value: '6-10', label: 'Questions asked' },
        { value: '15-20', label: 'Minutes per interview' },
      ],
    },
    sharePrompt: {
      title: 'Share Your Experience',
      description: 'Did you pass your citizenship test? Share your experience to help the community!',
      button: 'Submit Your Story',
      email: 'Email us at: stories@congdanmy.com',
    },
  },
};

const iconMap = {
  calendar: Calendar,
  users: Users,
  heart: Heart,
  star: Star,
};

export default async function StoriesPage({ params }: StoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = content[locale as Locale] || content.vi;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.back}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          {t.stats.title}
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {t.stats.items.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Featured Stories */}
      <div className="space-y-6 mb-8">
        {t.featuredStories.map((story, idx) => (
          <Card key={idx} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600" />

            {/* Story Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {story.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{story.age} {locale === 'vi' ? 'tuổi' : 'years old'}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    {story.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {story.date}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                story.program === '65/20'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}>
                {story.program}
              </span>
            </div>

            {/* Quote */}
            <div className="relative bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
              <Quote className="absolute top-2 left-2 w-6 h-6 text-gray-300 dark:text-slate-600" aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 italic pl-6">
                "{story.quote}"
              </p>
            </div>

            {/* Tips */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {locale === 'vi' ? 'Mẹo từ ' : 'Tips from '}{story.name.split(' ').slice(-1)[0]}:
              </h4>
              <ul className="grid sm:grid-cols-2 gap-2">
                {story.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5" aria-hidden="true">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Interview Tips Section */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.interviewTips.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.interviewTips.tips.map((tip, idx) => {
            const IconComponent = iconMap[tip.icon as keyof typeof iconMap];
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Share Prompt */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 text-center">
        <Heart className="w-12 h-12 text-purple-500 mx-auto mb-3" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.sharePrompt.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.sharePrompt.description}
        </p>
        <p className="text-sm text-purple-600 dark:text-purple-400">
          {t.sharePrompt.email}
        </p>
      </Card>
    </div>
  );
}
