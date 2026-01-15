'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Home,
  Wallet,
  Users,
  User,
  Cake,
  FileCheck,
  Plane,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  HelpCircle,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Star,
  Award,
  DollarSign,
  MessageCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import immigrationDataRaw from '@/data/immigration-guide.json';
import type { Locale } from '@/types';
import type { ImmigrationGuideData, InterviewSubcategory } from '@/types/immigration';

// Type the imported JSON data once at the top level
const immigrationData = immigrationDataRaw as ImmigrationGuideData;

type TabId = 'overview' | 'marriage' | 'i751' | 'n400' | 'consular' | 'stokes' | 'documents' | 'fees' | 'concerns' | 'tips' | 'faq';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  home: Home,
  wallet: Wallet,
  users: Users,
  user: User,
  cake: Cake,
  'file-check': FileCheck,
  plane: Plane,
  shield: Shield,
};

export function ImmigrationContent() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'vi';
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const tabs: { id: TabId; labelVi: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', labelVi: 'Tổng Quan', labelEn: 'Overview', icon: BookOpen },
    { id: 'marriage', labelVi: 'Green Card Hôn Nhân', labelEn: 'Marriage Green Card', icon: Heart },
    { id: 'i751', labelVi: 'Gỡ Điều Kiện I-751', labelEn: 'I-751 Removal', icon: FileCheck },
    { id: 'n400', labelVi: 'Phỏng Vấn Quốc Tịch', labelEn: 'N-400 Citizenship', icon: Award },
    { id: 'consular', labelVi: 'Phỏng Vấn Lãnh Sự', labelEn: 'Consular Interview', icon: Plane },
    { id: 'stokes', labelVi: 'Phỏng Vấn Stokes', labelEn: 'Stokes Interview', icon: Shield },
    { id: 'documents', labelVi: 'Giấy Tờ Cần Thiết', labelEn: 'Required Documents', icon: FileText },
    { id: 'fees', labelVi: 'Lệ Phí', labelEn: 'Fees', icon: DollarSign },
    { id: 'concerns', labelVi: 'Lo Lắng Thường Gặp', labelEn: 'Common Concerns', icon: MessageCircle },
    { id: 'tips', labelVi: 'Mẹo & Lưu Ý', labelEn: 'Tips & Warnings', icon: AlertTriangle },
    { id: 'faq', labelVi: 'Câu Hỏi Thường Gặp', labelEn: 'FAQ', icon: HelpCircle },
  ];

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge variant="error" className="text-xs">!</Badge>;
      case 'medium':
        return <Badge variant="warning" className="text-xs">●</Badge>;
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Green Card Types */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {locale === 'vi' ? 'Loại Thẻ Xanh' : 'Green Card Types'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {locale === 'vi' ? immigrationData.greenCardTypes.conditional.nameVi : immigrationData.greenCardTypes.conditional.nameEn}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {immigrationData.greenCardTypes.conditional.code} - {immigrationData.greenCardTypes.conditional.duration} {locale === 'vi' ? 'năm' : 'years'}
                </p>
                <ul className="text-sm space-y-1">
                  {immigrationData.greenCardTypes.conditional.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      {locale === 'vi' ? req.vi : req.en}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {locale === 'vi' ? immigrationData.greenCardTypes.permanent.nameVi : immigrationData.greenCardTypes.permanent.nameEn}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {immigrationData.greenCardTypes.permanent.code} - {immigrationData.greenCardTypes.permanent.duration} {locale === 'vi' ? 'năm' : 'years'}
                </p>
                <ul className="text-sm space-y-1">
                  {immigrationData.greenCardTypes.permanent.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      {locale === 'vi' ? req.vi : req.en}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Sponsorship Categories */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {locale === 'vi' ? 'Diện Bảo Lãnh' : 'Sponsorship Categories'}
        </h2>

        {/* Immediate Relatives */}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          {locale === 'vi' ? 'Người Thân Trực Tiếp (Không Giới Hạn Số Lượng)' : 'Immediate Relatives (No Quota Limits)'}
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Diện' : 'Category'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Người Bảo Lãnh' : 'Sponsor'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Người Được Bảo Lãnh' : 'Beneficiary'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Thời Gian' : 'Wait Time'}</th>
              </tr>
            </thead>
            <tbody>
              {immigrationData.sponsorshipCategories.immediate.map((cat) => (
                <tr key={cat.code} className="border-b border-gray-200 dark:border-slate-600">
                  <td className="px-4 py-3">
                    <Badge variant="success">{cat.code}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{locale === 'vi' ? cat.sponsor.vi : cat.sponsor.en}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{locale === 'vi' ? cat.beneficiary.vi : cat.beneficiary.en}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{cat.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Preference Categories */}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          {locale === 'vi' ? 'Diện Ưu Tiên (Có Giới Hạn Hàng Năm)' : 'Preference Categories (Annual Limits)'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Diện' : 'Category'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Người Bảo Lãnh' : 'Sponsor'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Người Được Bảo Lãnh' : 'Beneficiary'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Thời Gian Chờ' : 'Wait Time'}</th>
              </tr>
            </thead>
            <tbody>
              {immigrationData.sponsorshipCategories.preference.map((cat) => (
                <tr key={cat.code} className="border-b border-gray-200 dark:border-slate-600">
                  <td className="px-4 py-3">
                    <Badge variant="warning">{cat.code}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{locale === 'vi' ? cat.sponsor.vi : cat.sponsor.en}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{locale === 'vi' ? cat.beneficiary.vi : cat.beneficiary.en}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-medium">{cat.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Processing Times */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {locale === 'vi' ? 'Thời Gian Xử Lý' : 'Processing Times'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {immigrationData.processingTimes.map((item) => (
            <Card key={item.type} className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{item.time}</div>
              <div className="font-medium text-gray-900 dark:text-white">{item.type}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {locale === 'vi' ? item.nameVi : item.nameEn}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {locale === 'vi' ? 'Tài Nguyên Hữu Ích' : 'Useful Resources'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {immigrationData.resources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="font-medium text-gray-900 dark:text-white">{resource.name}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );

  const renderQuestionSection = (
    categoryName: string,
    subcategories: InterviewSubcategory[]
  ) => (
    <div className="space-y-4">
      {subcategories.map((subcat) => {
        const isExpanded = expandedCategories.includes(subcat.id);
        const IconComponent = iconMap[subcat.icon] || BookOpen;

        return (
          <Card key={subcat.id} className="overflow-hidden">
            <button
              onClick={() => toggleCategory(subcat.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              aria-expanded={isExpanded}
              aria-label={locale === 'vi' ? subcat.nameVi : subcat.nameEn}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {locale === 'vi' ? subcat.nameVi : subcat.nameEn}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subcat.questions.length} {locale === 'vi' ? 'câu hỏi' : 'questions'}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-slate-600">
                {subcat.questions.map((question, idx) => (
                  <div
                    key={question.id}
                    className={`p-4 ${idx !== subcat.questions.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {locale === 'vi' ? question.questionVi : question.questionEn}
                          </p>
                          {getImportanceBadge(question.importance)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {locale === 'vi' ? question.questionEn : question.questionVi}
                        </p>
                        {question.tips && (
                          <div className="mt-2 flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                            <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <span className="text-amber-700 dark:text-amber-300">
                              {locale === 'vi' ? question.tips.vi : question.tips.en}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-8">
      {/* Marriage Interview Documents */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {locale === 'vi' ? immigrationData.requiredDocuments.marriageInterview.nameVi : immigrationData.requiredDocuments.marriageInterview.nameEn}
        </h2>

        <Card className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
            {locale === 'vi' ? 'Giấy Tờ Bắt Buộc' : 'Required Documents'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.marriageInterview.required.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" aria-hidden="true" />
            {locale === 'vi' ? 'Bằng Chứng Hôn Nhân Thật' : 'Bona Fide Marriage Evidence'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.marriageInterview.evidence?.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Consular Interview Documents */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {locale === 'vi' ? immigrationData.requiredDocuments.consularInterview.nameVi : immigrationData.requiredDocuments.consularInterview.nameEn}
        </h2>

        <Card className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
            {locale === 'vi' ? 'Giấy Tờ Bắt Buộc' : 'Required Documents'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.consularInterview.required.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" aria-hidden="true" />
            {locale === 'vi' ? 'Giấy Tờ Tài Chính' : 'Financial Documents'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.consularInterview.financial?.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );

  const renderTips = () => (
    <div className="space-y-8">
      {/* Do's */}
      <section>
        <Card className="border-l-4 border-l-green-500">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            {locale === 'vi' ? 'NÊN LÀM' : "DO'S"}
          </h2>
          <ul className="space-y-3">
            {immigrationData.tips.do.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {locale === 'vi' ? tip.vi : tip.en}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Don'ts */}
      <section>
        <Card className="border-l-4 border-l-red-500">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-6 h-6" aria-hidden="true" />
            {locale === 'vi' ? 'KHÔNG NÊN' : "DON'TS"}
          </h2>
          <ul className="space-y-3">
            {immigrationData.tips.dont.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {locale === 'vi' ? tip.vi : tip.en}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Red Flags */}
      <section>
        <Card className="border-l-4 border-l-amber-500">
          <h2 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            {locale === 'vi' ? 'DẤU HIỆU CẦN LƯU Ý' : 'RED FLAGS'}
          </h2>
          <div className="space-y-4">
            {immigrationData.redFlags.map((flag, idx) => (
              <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="font-medium text-amber-800 dark:text-amber-300">
                  {locale === 'vi' ? flag.vi : flag.en}
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  {locale === 'vi' ? flag.explanation.vi : flag.explanation.en}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-4">
      {immigrationData.faq.map((item, idx) => (
        <Card key={idx}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {locale === 'vi' ? item.questionVi : item.questionEn}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {locale === 'vi' ? item.answerVi : item.answerEn}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderN400 = () => {
    const n400Data = immigrationData.n400CitizenshipInterview;

    return (
      <div className="space-y-4">
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                {locale === 'vi' ? n400Data.categoryNameVi : n400Data.categoryNameEn}
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                {locale === 'vi' ? n400Data.description?.vi : n400Data.description?.en}
              </p>
            </div>
          </div>
        </Card>
        {renderQuestionSection(
          locale === 'vi' ? 'Phỏng Vấn Quốc Tịch' : 'Citizenship Interview',
          n400Data.subcategories
        )}
      </div>
    );
  };

  const renderStokes = () => {
    const stokesData = immigrationData.stokesInterview;

    return (
      <div className="space-y-6">
        {/* Warning Banner */}
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                {locale === 'vi' ? stokesData.nameVi : stokesData.nameEn}
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {locale === 'vi' ? stokesData.description.vi : stokesData.description.en}
              </p>
            </div>
          </div>
        </Card>

        {/* When Triggered */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
            {locale === 'vi' ? 'Khi Nào Bị Gọi Phỏng Vấn Stokes?' : 'When is Stokes Interview Triggered?'}
          </h3>
          <ul className="space-y-2">
            {stokesData.whenTriggered.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? item.vi : item.en}
              </li>
            ))}
          </ul>
        </Card>

        {/* How It Works */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" aria-hidden="true" />
            {locale === 'vi' ? 'Phỏng Vấn Diễn Ra Như Thế Nào?' : 'How Does It Work?'}
          </h3>
          <ol className="space-y-2">
            {stokesData.howItWorks.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                  {idx + 1}
                </span>
                {locale === 'vi' ? item.vi : item.en}
              </li>
            ))}
          </ol>
        </Card>

        {/* Typical Questions */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" aria-hidden="true" />
            {locale === 'vi' ? 'Câu Hỏi Thường Gặp Trong Stokes' : 'Typical Stokes Questions'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {stokesData.typicalQuestions.map((item, idx) => (
              <div key={idx} className="p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm text-gray-700 dark:text-gray-200">
                {locale === 'vi' ? item.vi : item.en}
              </div>
            ))}
          </div>
        </Card>

        {/* Tips */}
        <Card className="border-l-4 border-l-green-500">
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            {locale === 'vi' ? 'Mẹo Vượt Qua Phỏng Vấn Stokes' : 'Tips for Stokes Interview'}
          </h3>
          <ul className="space-y-2">
            {stokesData.tips.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? item.vi : item.en}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };

  const renderFees = () => {
    const feesData = immigrationData.formFees;

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300">
                  {locale === 'vi' ? feesData.nameVi : feesData.nameEn}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {locale === 'vi' ? `Cập nhật: ${feesData.lastUpdated}` : `Last updated: ${feesData.lastUpdated}`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Fees Table */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" aria-hidden="true" />
            {locale === 'vi' ? 'Lệ Phí Các Form USCIS' : 'USCIS Form Fees'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Form</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Mô Tả' : 'Description'}</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Lệ Phí' : 'Fee'}</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{locale === 'vi' ? 'Ghi Chú' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody>
                {feesData.forms.map((form) => (
                  <tr key={form.form} className="border-b border-gray-200 dark:border-slate-600">
                    <td className="px-4 py-3">
                      <Badge variant="info">{form.form}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {locale === 'vi' ? form.nameVi : form.nameEn}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                      {form.fee}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {locale === 'vi' ? form.notes.vi : form.notes.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Additional Costs */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-500" aria-hidden="true" />
            {locale === 'vi' ? 'Chi Phí Khác' : 'Additional Costs'}
          </h3>
          <ul className="space-y-2">
            {feesData.additionalCosts.map((cost, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <DollarSign className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                {locale === 'vi' ? cost.vi : cost.en}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };

  const renderConcerns = () => {
    const concernsData = immigrationData.commonConcerns;

    return (
      <div className="space-y-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                {locale === 'vi' ? concernsData.nameVi : concernsData.nameEn}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {locale === 'vi'
                  ? 'Nhiều người có cùng lo lắng như bạn. Đây là những vấn đề phổ biến và lời khuyên.'
                  : 'Many people share your concerns. Here are common worries and advice.'}
              </p>
            </div>
          </div>
        </Card>

        {concernsData.concerns.map((item, idx) => (
          <Card key={idx}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {locale === 'vi' ? item.concernVi : item.concernEn}
                  </h3>
                </div>
              </div>
              <div className="ml-11 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {locale === 'vi' ? item.adviceVi : item.adviceEn}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'marriage':
        return renderQuestionSection(
          locale === 'vi' ? 'Green Card Hôn Nhân' : 'Marriage Green Card',
          immigrationData.interviewQuestions.marriageGreenCard.subcategories
        );
      case 'i751':
        return (
          <div className="space-y-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300">
                {locale === 'vi'
                  ? 'Phỏng vấn I-751 để gỡ điều kiện trên thẻ xanh 2 năm. Chuẩn bị bằng chứng hôn nhân thật sự trong 2 năm qua.'
                  : 'I-751 interview to remove conditions on your 2-year green card. Prepare evidence of bona fide marriage over the past 2 years.'}
              </p>
            </Card>
            {renderQuestionSection(
              locale === 'vi' ? 'Gỡ Điều Kiện I-751' : 'I-751 Removal of Conditions',
              immigrationData.interviewQuestions.i751RemovalOfConditions.subcategories
            )}
          </div>
        );
      case 'n400':
        return renderN400();
      case 'consular':
        return renderQuestionSection(
          locale === 'vi' ? 'Phỏng Vấn Lãnh Sự' : 'Consular Interview',
          immigrationData.interviewQuestions.consularInterview.subcategories
        );
      case 'stokes':
        return renderStokes();
      case 'documents':
        return renderDocuments();
      case 'fees':
        return renderFees();
      case 'concerns':
        return renderConcerns();
      case 'tips':
        return renderTips();
      case 'faq':
        return renderFAQ();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {locale === 'vi' ? 'Trang chủ' : 'Home'}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Plane className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {locale === 'vi' ? 'Hướng Dẫn Phỏng Vấn Di Trú Mỹ' : 'US Immigration Interview Guide'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          {locale === 'vi'
            ? 'Tổng hợp 280+ câu hỏi phỏng vấn, lệ phí, lo lắng thường gặp, và mẹo chuẩn bị'
            : '280+ interview questions, fees, common concerns, and preparation tips'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{immigrationData.metadata.totalQuestions} {locale === 'vi' ? 'câu hỏi' : 'questions'}</Badge>
          <Badge variant="success">{immigrationData.metadata.categories} {locale === 'vi' ? 'danh mục' : 'categories'}</Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2" role="tablist" aria-label={locale === 'vi' ? 'Danh mục nội dung' : 'Content categories'}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <TabIcon className="w-4 h-4" aria-hidden="true" />
                {locale === 'vi' ? tab.labelVi : tab.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={activeTab}>
        {renderContent()}
      </div>
    </div>
  );
}
