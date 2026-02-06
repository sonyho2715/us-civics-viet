'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  CalendarCheck,
  Clock,
  ListChecks,
  Lightbulb,
  Award,
  ClipboardList,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface ChecklistItem {
  text_en: string;
  text_vi: string;
}

interface Section {
  title_en: string;
  title_vi: string;
  icon: React.ReactNode;
  type: 'checklist' | 'info';
  items: ChecklistItem[];
  gradient: string;
}

const sections: Section[] = [
  {
    title_en: 'Documents to Bring',
    title_vi: 'Giấy Tờ Cần Mang',
    icon: <FileText className="w-5 h-5" aria-hidden="true" />,
    type: 'checklist',
    gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    items: [
      { text_en: 'Appointment notice (Form I-797C)', text_vi: 'Thông báo lịch hẹn (Mẫu I-797C)' },
      { text_en: 'Permanent Resident Card (Green Card)', text_vi: 'Thẻ thường trú nhân (Thẻ Xanh)' },
      { text_en: 'Valid passport or travel document', text_vi: 'Hộ chiếu hoặc giấy tờ đi lại còn hạn' },
      { text_en: 'State-issued ID or driver\'s license', text_vi: 'Giấy phép lái xe hoặc ID tiểu bang' },
      { text_en: 'Two passport-style photos (if needed)', text_vi: 'Hai ảnh kiểu hộ chiếu (nếu cần)' },
    ],
  },
  {
    title_en: 'Before Interview Day',
    title_vi: 'Trước Ngày Phỏng Vấn',
    icon: <CalendarCheck className="w-5 h-5" aria-hidden="true" />,
    type: 'checklist',
    gradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
    items: [
      { text_en: 'Review your N-400 application', text_vi: 'Xem lại đơn N-400 của bạn' },
      { text_en: 'Study all 128 civics questions (or 20 for 65/20)', text_vi: 'Học hết 128 câu hỏi (hoặc 20 cho 65/20)' },
      { text_en: 'Practice reading and writing in English', text_vi: 'Luyện đọc và viết tiếng Anh' },
      { text_en: 'Know your travel route to USCIS office', text_vi: 'Biết đường đi đến văn phòng USCIS' },
      { text_en: 'Get documents organized in a folder', text_vi: 'Sắp xếp giấy tờ vào một bìa hồ sơ' },
    ],
  },
  {
    title_en: 'Day of Interview',
    title_vi: 'Ngày Phỏng Vấn',
    icon: <ListChecks className="w-5 h-5" aria-hidden="true" />,
    type: 'checklist',
    gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    items: [
      { text_en: 'Arrive 15-30 minutes early', text_vi: 'Đến sớm 15-30 phút' },
      { text_en: 'Dress professionally', text_vi: 'Ăn mặc lịch sự' },
      { text_en: 'Turn off your phone', text_vi: 'Tắt điện thoại' },
      { text_en: 'Bring water and a snack', text_vi: 'Mang theo nước và đồ ăn nhẹ' },
      { text_en: 'Stay calm and confident', text_vi: 'Giữ bình tĩnh và tự tin' },
    ],
  },
  {
    title_en: 'What to Expect (Timeline)',
    title_vi: 'Những Gì Sẽ Xảy Ra (Trình Tự)',
    icon: <Clock className="w-5 h-5" aria-hidden="true" />,
    type: 'info',
    gradient: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
    items: [
      { text_en: 'Check-in at reception', text_vi: 'Đăng ký tại quầy tiếp tân' },
      { text_en: 'Wait in the waiting room', text_vi: 'Ngồi chờ ở phòng đợi' },
      { text_en: 'Officer calls your name', text_vi: 'Viên chức gọi tên bạn' },
      { text_en: 'Oath/identity verification', text_vi: 'Xác minh danh tính/tuyên thệ' },
      { text_en: 'English reading and writing test', text_vi: 'Bài kiểm tra đọc viết tiếng Anh' },
      { text_en: 'Civics test (up to 10 questions, need 6 correct)', text_vi: 'Bài thi công dân (tối đa 10 câu, cần đúng 6)' },
      { text_en: 'N-400 review', text_vi: 'Xem xét đơn N-400' },
      { text_en: 'Decision notification', text_vi: 'Thông báo kết quả' },
    ],
  },
  {
    title_en: 'Civics Test Tips',
    title_vi: 'Mẹo Thi Công Dân',
    icon: <Lightbulb className="w-5 h-5" aria-hidden="true" />,
    type: 'info',
    gradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    items: [
      { text_en: 'Listen carefully to each question', text_vi: 'Lắng nghe kỹ từng câu hỏi' },
      { text_en: "It's OK to ask the officer to repeat", text_vi: 'Có thể xin viên chức nhắc lại' },
      { text_en: 'Answer in simple, clear English', text_vi: 'Trả lời bằng tiếng Anh đơn giản, rõ ràng' },
      { text_en: 'You only need 6 out of 10 correct', text_vi: 'Bạn chỉ cần đúng 6 trong 10 câu' },
      { text_en: 'The test stops when you get 6 right', text_vi: 'Bài thi dừng khi bạn đúng 6 câu' },
    ],
  },
  {
    title_en: 'After the Interview',
    title_vi: 'Sau Buổi Phỏng Vấn',
    icon: <Award className="w-5 h-5" aria-hidden="true" />,
    type: 'info',
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
    items: [
      { text_en: 'Three possible outcomes: Approved, Continued, Denied', text_vi: 'Ba kết quả: Chấp thuận, Tiếp tục xem xét, Từ chối' },
      { text_en: 'If approved: receive oath ceremony notice', text_vi: 'Nếu đậu: nhận thông báo lễ tuyên thệ' },
      { text_en: 'Take the Oath of Allegiance', text_vi: 'Tham dự Lễ Tuyên Thệ Trung Thành' },
      { text_en: 'Receive Certificate of Naturalization', text_vi: 'Nhận Giấy Chứng Nhận Nhập Tịch' },
    ],
  },
];

export function ExamDayContent() {
  const { locale } = useParams<{ locale: string }>();
  const isVi = (locale as Locale) === 'vi';

  // Track checked items per section: sectionIndex -> set of item indices
  const [checked, setChecked] = useState<Record<number, Set<number>>>({});

  function toggleItem(sectionIdx: number, itemIdx: number) {
    setChecked((prev) => {
      const sectionSet = new Set(prev[sectionIdx] || []);
      if (sectionSet.has(itemIdx)) {
        sectionSet.delete(itemIdx);
      } else {
        sectionSet.add(itemIdx);
      }
      return { ...prev, [sectionIdx]: sectionSet };
    });
  }

  function isChecked(sectionIdx: number, itemIdx: number): boolean {
    return checked[sectionIdx]?.has(itemIdx) ?? false;
  }

  // Count total checklist items and how many are checked
  const checklistSections = sections
    .map((s, i) => ({ section: s, index: i }))
    .filter(({ section }) => section.type === 'checklist');
  const totalCheckable = checklistSections.reduce(
    (sum, { section }) => sum + section.items.length,
    0
  );
  const totalChecked = checklistSections.reduce(
    (sum, { index }) => sum + (checked[index]?.size ?? 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {isVi ? 'Trang chủ' : 'Home'}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {isVi ? 'Chuẩn Bị Ngày Thi' : 'Exam Day Preparation'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {isVi
            ? 'Danh sách kiểm tra giúp bạn sẵn sàng cho ngày phỏng vấn quốc tịch Mỹ.'
            : 'A checklist to help you get ready for your U.S. citizenship interview day.'}
        </p>
      </div>

      {/* Progress bar for checklists */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isVi ? 'Tiến độ chuẩn bị' : 'Preparation progress'}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {totalChecked}/{totalCheckable}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${totalCheckable > 0 ? (totalChecked / totalCheckable) * 100 : 0}%` }}
          />
        </div>
        {totalChecked === totalCheckable && totalCheckable > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
            {isVi ? 'B\u1EA1n \u0111\u00E3 s\u1EB5n s\u00E0ng! Ch\u00FAc may m\u1EAFn!' : 'You are all set! Good luck!'}
          </p>
        )}
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <Card
            key={sIdx}
            className={`bg-gradient-to-r ${section.gradient}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm text-gray-700 dark:text-gray-300">
                {section.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isVi ? section.title_vi : section.title_en}
              </h2>
            </div>

            <div className="space-y-3">
              {section.items.map((item, iIdx) => {
                const itemChecked = isChecked(sIdx, iIdx);

                if (section.type === 'checklist') {
                  return (
                    <button
                      key={iIdx}
                      type="button"
                      onClick={() => toggleItem(sIdx, iIdx)}
                      className="flex items-start gap-3 w-full text-left p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      {itemChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <span
                        className={`text-sm ${
                          itemChecked
                            ? 'text-gray-400 dark:text-gray-500 line-through'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {isVi ? item.text_vi : item.text_en}
                      </span>
                    </button>
                  );
                }

                // Info items: numbered timeline style
                return (
                  <div
                    key={iIdx}
                    className="flex items-start gap-3 p-2"
                  >
                    <div className="w-6 h-6 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm mt-0.5">
                      {iIdx + 1}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {isVi ? item.text_vi : item.text_en}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Encouragement footer */}
      <Card className="mt-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <Award className="w-12 h-12 text-blue-500 mx-auto mb-3" aria-hidden="true" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {isVi ? 'B\u1EA1n S\u1EBD L\u00E0m \u0110\u01B0\u1EE3c!' : 'You Can Do It!'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {isVi
            ? 'H\u00E0ng tri\u1EC7u ng\u01B0\u1EDDi \u0111\u00E3 thi \u0111\u1EADu qu\u1ED1c t\u1ECBch M\u1EF9. V\u1EDBi s\u1EF1 chu\u1EA9n b\u1ECB t\u1ED1t, b\u1EA1n c\u0169ng s\u1EBD th\u00E0nh c\u00F4ng.'
            : 'Millions of people have passed the citizenship test. With good preparation, you will succeed too.'}
        </p>
      </Card>
    </div>
  );
}
