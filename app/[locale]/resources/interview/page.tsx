import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  FileText,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  Users,
  BookOpen,
  PenLine,
  Volume2,
  Calendar,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface InterviewPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: InterviewPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    vi: 'Mẹo Phỏng Vấn Quốc Tịch - Công Dân Mỹ',
    en: 'Citizenship Interview Tips - U.S. Citizenship',
  };

  const descriptions = {
    vi: 'Hướng dẫn chi tiết chuẩn bị phỏng vấn quốc tịch Mỹ. Mẹo thi tiếng Anh, công dân, và những điều cần tránh.',
    en: 'Detailed guide for U.S. citizenship interview preparation. Tips for English test, civics test, and common mistakes to avoid.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.vi,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.vi,
  };
}

const content = {
  vi: {
    title: 'Mẹo Phỏng Vấn Quốc Tịch',
    subtitle: 'Hướng dẫn chi tiết để chuẩn bị tốt nhất cho ngày phỏng vấn',
    back: 'Trang chủ',

    whatToExpect: {
      title: 'Quy Trình Phỏng Vấn',
      description: 'Hiểu rõ những gì sẽ xảy ra trong buổi phỏng vấn',
      steps: [
        {
          icon: 'clock',
          title: 'Đến Sớm',
          time: '30 phút trước',
          description: 'Đến văn phòng USCIS sớm. Bạn cần qua an ninh và tìm phòng chờ.',
        },
        {
          icon: 'users',
          title: 'Chờ Gọi Tên',
          time: '15-45 phút',
          description: 'Ngồi trong phòng chờ cho đến khi viên chức gọi tên bạn.',
        },
        {
          icon: 'penline',
          title: 'Bài Thi Viết',
          time: '2-5 phút',
          description: 'Viên chức đọc 1-3 câu tiếng Anh, bạn viết lại trên giấy.',
        },
        {
          icon: 'volume',
          title: 'Bài Thi Đọc',
          time: '2-5 phút',
          description: 'Bạn đọc to 1-3 câu tiếng Anh từ màn hình hoặc thẻ.',
        },
        {
          icon: 'messagesquare',
          title: 'Bài Thi Công Dân',
          time: '10-15 phút',
          description: 'Trả lời 6/10 câu đúng về lịch sử và chính phủ Mỹ.',
        },
        {
          icon: 'filetext',
          title: 'Xác Minh N-400',
          time: '10-20 phút',
          description: 'Viên chức hỏi các câu hỏi từ đơn N-400 của bạn.',
        },
      ],
    },

    englishTest: {
      title: 'Mẹo Thi Tiếng Anh',
      reading: {
        title: 'Bài Thi Đọc',
        tips: [
          'Đọc to, rõ ràng, không cần nhanh',
          'Nếu đọc sai, có thể đọc lại câu đó',
          'Tập đọc các từ thường gặp: "President", "Congress", "citizen"',
          'Không cần phát âm hoàn hảo, chỉ cần hiểu được',
        ],
      },
      writing: {
        title: 'Bài Thi Viết',
        tips: [
          'Viết rõ ràng, chữ in hoa hoặc chữ thường đều được',
          'Nghe kỹ trước khi viết, có thể xin nhắc lại',
          'Lỗi chính tả nhỏ thường được chấp nhận',
          'Tập viết các câu đơn giản về chính phủ Mỹ',
        ],
      },
      speaking: {
        title: 'Giao Tiếp',
        tips: [
          'Viên chức đánh giá tiếng Anh qua cả cuộc phỏng vấn',
          'Trả lời câu hỏi bằng câu đơn giản, không cần phức tạp',
          'Nếu không hiểu, hãy nói: "Can you repeat that, please?"',
          'Nói chậm, rõ ràng tốt hơn nói nhanh mà không rõ',
        ],
      },
    },

    civicsTest: {
      title: 'Mẹo Thi Công Dân',
      description: 'Viên chức hỏi 10 câu, bạn cần trả lời đúng 6 câu',
      tips: [
        {
          icon: 'book',
          title: 'Học Theo Chủ Đề',
          description: 'Nhóm câu hỏi theo chủ đề (Tổng thống, Quốc hội, Lịch sử) giúp nhớ dễ hơn.',
        },
        {
          icon: 'lightbulb',
          title: 'Hiểu, Không Học Vẹt',
          description: 'Hiểu ý nghĩa câu hỏi giúp trả lời ngay cả khi câu hỏi được diễn đạt khác.',
        },
        {
          icon: 'messagesquare',
          title: 'Trả Lời Ngắn Gọn',
          description: 'Không cần nói hết tất cả đáp án. Một đáp án đúng là đủ.',
        },
        {
          icon: 'alerttriangle',
          title: 'Câu Hỏi Thay Đổi',
          description: 'Một số câu có đáp án thay đổi (Tổng thống, Thượng nghị sĩ). Cập nhật thông tin mới.',
        },
      ],
    },

    whatToBring: {
      title: 'Mang Theo Gì?',
      required: {
        title: 'Bắt Buộc',
        items: [
          'Thư mời phỏng vấn (Appointment Letter)',
          'Thẻ xanh (Green Card / Permanent Resident Card)',
          'Hộ chiếu hoặc ID có ảnh',
          'Hộ chiếu cũ (nếu đi du lịch nước ngoài)',
        ],
      },
      recommended: {
        title: 'Nên Mang',
        items: [
          'Bản sao đơn N-400 đã nộp',
          'Giấy tờ chứng minh (kết hôn, ly hôn, thuế)',
          'Bút và giấy để ghi chú',
          'Nước uống và đồ ăn nhẹ (có thể chờ lâu)',
        ],
      },
    },

    commonMistakes: {
      title: 'Những Sai Lầm Cần Tránh',
      mistakes: [
        {
          wrong: 'Đến trễ hoặc vừa đúng giờ',
          right: 'Đến sớm 30 phút để có thời gian qua an ninh',
          icon: 'clock',
        },
        {
          wrong: 'Mang theo nhiều người',
          right: 'Đi một mình hoặc chỉ một người đi kèm nếu cần thiết',
          icon: 'users',
        },
        {
          wrong: 'Nói dối hoặc che giấu thông tin',
          right: 'Trả lời trung thực. USCIS đã biết lịch sử của bạn',
          icon: 'alerttriangle',
        },
        {
          wrong: 'Đoán câu trả lời khi không chắc',
          right: 'Nói "I don\'t remember" nếu thật sự không nhớ',
          icon: 'messagesquare',
        },
        {
          wrong: 'Không chuẩn bị đơn N-400',
          right: 'Đọc lại đơn N-400 và nhớ các thông tin đã khai',
          icon: 'filetext',
        },
        {
          wrong: 'Căng thẳng quá mức',
          right: 'Bình tĩnh. Viên chức muốn giúp bạn đậu',
          icon: 'lightbulb',
        },
      ],
    },

    dayBefore: {
      title: 'Đêm Trước Ngày Thi',
      tips: [
        {
          icon: 'calendar',
          title: 'Chuẩn Bị Giấy Tờ',
          description: 'Sắp xếp tất cả giấy tờ vào một túi/cặp. Kiểm tra lại danh sách.',
        },
        {
          icon: 'mappin',
          title: 'Tìm Đường Đi',
          description: 'Tìm đường đến văn phòng USCIS, bãi đỗ xe, và thời gian di chuyển.',
        },
        {
          icon: 'clock',
          title: 'Ngủ Đủ Giấc',
          description: 'Ngủ sớm, nghỉ ngơi đầy đủ. Không thức khuya ôn bài.',
        },
        {
          icon: 'briefcase',
          title: 'Chọn Trang Phục',
          description: 'Mặc trang phục lịch sự, thoải mái. Không cần quá trang trọng.',
        },
      ],
    },

    afterInterview: {
      title: 'Sau Phỏng Vấn',
      outcomes: [
        {
          status: 'pass',
          title: 'Đậu',
          description: 'Bạn sẽ nhận được thư mời tham dự lễ tuyên thệ trong vài tuần.',
          color: 'green',
        },
        {
          status: 'continue',
          title: 'Cần Bổ Sung',
          description: 'USCIS cần thêm giấy tờ hoặc cần thêm thời gian xác minh.',
          color: 'yellow',
        },
        {
          status: 'retest',
          title: 'Thi Lại',
          description: 'Nếu trượt bài thi, bạn có cơ hội thi lại trong 60-90 ngày.',
          color: 'blue',
        },
        {
          status: 'fail',
          title: 'Từ Chối',
          description: 'Nếu bị từ chối, bạn có quyền kháng cáo hoặc nộp đơn mới.',
          color: 'red',
        },
      ],
    },

    encouragement: {
      title: 'Bạn Sẽ Làm Được!',
      message: 'Hàng triệu người đã đậu bài thi này. Với sự chuẩn bị tốt, bạn cũng sẽ thành công. Viên chức USCIS muốn giúp bạn trở thành công dân Mỹ.',
      stats: [
        { value: '91%', label: 'Tỷ lệ đậu' },
        { value: '15-30', label: 'Phút phỏng vấn' },
        { value: '6/10', label: 'Câu cần đúng' },
      ],
    },
  },
  en: {
    title: 'Citizenship Interview Tips',
    subtitle: 'Detailed guide to best prepare for your interview day',
    back: 'Home',

    whatToExpect: {
      title: 'Interview Process',
      description: 'Understand what will happen during your interview',
      steps: [
        {
          icon: 'clock',
          title: 'Arrive Early',
          time: '30 minutes before',
          description: 'Arrive at the USCIS office early. You need to go through security and find the waiting room.',
        },
        {
          icon: 'users',
          title: 'Wait to be Called',
          time: '15-45 minutes',
          description: 'Sit in the waiting room until the officer calls your name.',
        },
        {
          icon: 'penline',
          title: 'Writing Test',
          time: '2-5 minutes',
          description: 'The officer reads 1-3 English sentences, you write them down on paper.',
        },
        {
          icon: 'volume',
          title: 'Reading Test',
          time: '2-5 minutes',
          description: 'You read aloud 1-3 English sentences from a screen or card.',
        },
        {
          icon: 'messagesquare',
          title: 'Civics Test',
          time: '10-15 minutes',
          description: 'Answer 6 out of 10 questions correctly about U.S. history and government.',
        },
        {
          icon: 'filetext',
          title: 'N-400 Review',
          time: '10-20 minutes',
          description: 'The officer asks questions from your N-400 application.',
        },
      ],
    },

    englishTest: {
      title: 'English Test Tips',
      reading: {
        title: 'Reading Test',
        tips: [
          'Read aloud, clearly, no need to rush',
          'If you make a mistake, you can re-read that sentence',
          'Practice reading common words: "President", "Congress", "citizen"',
          'Perfect pronunciation not required, just be understandable',
        ],
      },
      writing: {
        title: 'Writing Test',
        tips: [
          'Write clearly, uppercase or lowercase is fine',
          'Listen carefully before writing, you can ask them to repeat',
          'Small spelling errors are usually accepted',
          'Practice writing simple sentences about U.S. government',
        ],
      },
      speaking: {
        title: 'Communication',
        tips: [
          'The officer evaluates your English throughout the interview',
          'Answer questions with simple sentences, no need to be complex',
          'If you don\'t understand, say: "Can you repeat that, please?"',
          'Speaking slowly and clearly is better than fast and unclear',
        ],
      },
    },

    civicsTest: {
      title: 'Civics Test Tips',
      description: 'The officer asks 10 questions, you need to answer 6 correctly',
      tips: [
        {
          icon: 'book',
          title: 'Study by Topic',
          description: 'Grouping questions by topic (Presidents, Congress, History) helps remember easier.',
        },
        {
          icon: 'lightbulb',
          title: 'Understand, Don\'t Memorize',
          description: 'Understanding the meaning helps answer even when questions are worded differently.',
        },
        {
          icon: 'messagesquare',
          title: 'Answer Briefly',
          description: 'No need to give all possible answers. One correct answer is enough.',
        },
        {
          icon: 'alerttriangle',
          title: 'Changing Answers',
          description: 'Some questions have changing answers (President, Senators). Stay updated.',
        },
      ],
    },

    whatToBring: {
      title: 'What to Bring?',
      required: {
        title: 'Required',
        items: [
          'Interview Appointment Letter',
          'Green Card (Permanent Resident Card)',
          'Passport or photo ID',
          'Old passports (if you traveled abroad)',
        ],
      },
      recommended: {
        title: 'Recommended',
        items: [
          'Copy of your N-400 application',
          'Supporting documents (marriage, divorce, taxes)',
          'Pen and paper for notes',
          'Water and snacks (may wait long)',
        ],
      },
    },

    commonMistakes: {
      title: 'Common Mistakes to Avoid',
      mistakes: [
        {
          wrong: 'Arriving late or just on time',
          right: 'Arrive 30 minutes early to have time for security',
          icon: 'clock',
        },
        {
          wrong: 'Bringing many people',
          right: 'Go alone or with just one companion if needed',
          icon: 'users',
        },
        {
          wrong: 'Lying or hiding information',
          right: 'Answer honestly. USCIS already knows your history',
          icon: 'alerttriangle',
        },
        {
          wrong: 'Guessing answers when unsure',
          right: 'Say "I don\'t remember" if you truly don\'t',
          icon: 'messagesquare',
        },
        {
          wrong: 'Not preparing N-400',
          right: 'Review your N-400 and remember the information you provided',
          icon: 'filetext',
        },
        {
          wrong: 'Being overly nervous',
          right: 'Stay calm. The officer wants to help you pass',
          icon: 'lightbulb',
        },
      ],
    },

    dayBefore: {
      title: 'The Night Before',
      tips: [
        {
          icon: 'calendar',
          title: 'Prepare Documents',
          description: 'Organize all documents in one bag/folder. Check the list again.',
        },
        {
          icon: 'mappin',
          title: 'Find Directions',
          description: 'Find the route to USCIS office, parking, and travel time.',
        },
        {
          icon: 'clock',
          title: 'Get Enough Sleep',
          description: 'Sleep early, rest well. Don\'t stay up late studying.',
        },
        {
          icon: 'briefcase',
          title: 'Choose Your Outfit',
          description: 'Wear neat, comfortable clothing. No need to be too formal.',
        },
      ],
    },

    afterInterview: {
      title: 'After the Interview',
      outcomes: [
        {
          status: 'pass',
          title: 'Passed',
          description: 'You will receive an invitation to the oath ceremony within a few weeks.',
          color: 'green',
        },
        {
          status: 'continue',
          title: 'Continued',
          description: 'USCIS needs more documents or time to verify information.',
          color: 'yellow',
        },
        {
          status: 'retest',
          title: 'Retest',
          description: 'If you fail the test, you get another chance within 60-90 days.',
          color: 'blue',
        },
        {
          status: 'fail',
          title: 'Denied',
          description: 'If denied, you have the right to appeal or submit a new application.',
          color: 'red',
        },
      ],
    },

    encouragement: {
      title: 'You Can Do This!',
      message: 'Millions of people have passed this test. With good preparation, you will succeed too. USCIS officers want to help you become a U.S. citizen.',
      stats: [
        { value: '91%', label: 'Pass rate' },
        { value: '15-30', label: 'Minutes interview' },
        { value: '6/10', label: 'Questions needed' },
      ],
    },
  },
};

const iconMap = {
  clock: Clock,
  users: Users,
  penline: PenLine,
  volume: Volume2,
  messagesquare: MessageSquare,
  filetext: FileText,
  book: BookOpen,
  lightbulb: Lightbulb,
  alerttriangle: AlertTriangle,
  calendar: Calendar,
  mappin: MapPin,
  briefcase: Briefcase,
  checksquare: CheckSquare,
};

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = content[locale as Locale] || content.vi;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.back}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Interview Process */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.whatToExpect.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t.whatToExpect.description}
        </p>
        <div className="space-y-4">
          {t.whatToExpect.steps.map((step, idx) => {
            const IconComponent = iconMap[step.icon as keyof typeof iconMap];
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {idx + 1}. {step.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* English Test Tips */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.englishTest.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Reading */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t.englishTest.reading.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {t.englishTest.reading.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 mt-0.5" aria-hidden="true">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Writing */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PenLine className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t.englishTest.writing.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {t.englishTest.writing.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-blue-500 mt-0.5" aria-hidden="true">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Speaking */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t.englishTest.speaking.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {t.englishTest.speaking.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-purple-500 mt-0.5" aria-hidden="true">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Civics Test Tips */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.civicsTest.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.civicsTest.description}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {t.civicsTest.tips.map((tip, idx) => {
            const IconComponent = iconMap[tip.icon as keyof typeof iconMap];
            return (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
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

      {/* What to Bring */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.whatToBring.required.title}
            </h2>
          </div>
          <ul className="space-y-2">
            {t.whatToBring.required.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-green-500 font-bold" aria-hidden="true">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.whatToBring.recommended.title}
            </h2>
          </div>
          <ul className="space-y-2">
            {t.whatToBring.recommended.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-blue-500 font-bold" aria-hidden="true">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Common Mistakes */}
      <Card className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.commonMistakes.title}
          </h2>
        </div>
        <div className="space-y-4">
          {t.commonMistakes.mistakes.map((mistake, idx) => {
            const IconComponent = iconMap[mistake.icon as keyof typeof iconMap];
            return (
              <div key={idx} className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-red-500 font-bold text-lg" aria-hidden="true">✗</span>
                  <p className="text-sm text-red-700 dark:text-red-300">{mistake.wrong}</p>
                </div>
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500 font-bold text-lg" aria-hidden="true">✓</span>
                  <p className="text-sm text-green-700 dark:text-green-300">{mistake.right}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Day Before */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.dayBefore.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.dayBefore.tips.map((tip, idx) => {
            const IconComponent = iconMap[tip.icon as keyof typeof iconMap];
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <IconComponent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
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

      {/* After Interview */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.afterInterview.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.afterInterview.outcomes.map((outcome, idx) => {
            const colorMap = {
              green: 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20',
              yellow: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20',
              blue: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20',
              red: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
            };
            const textColorMap = {
              green: 'text-green-700 dark:text-green-300',
              yellow: 'text-yellow-700 dark:text-yellow-300',
              blue: 'text-blue-700 dark:text-blue-300',
              red: 'text-red-700 dark:text-red-300',
            };
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${colorMap[outcome.color as keyof typeof colorMap]}`}
              >
                <h3 className={`font-medium mb-1 ${textColorMap[outcome.color as keyof typeof textColorMap]}`}>
                  {outcome.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {outcome.description}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 text-center">
        <Lightbulb className="w-12 h-12 text-green-500 mx-auto mb-3" aria-hidden="true" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t.encouragement.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          {t.encouragement.message}
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {t.encouragement.stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
