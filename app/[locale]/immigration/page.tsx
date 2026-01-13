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
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import immigrationData from '@/data/immigration-guide.json';
import type { Locale } from '@/types';

type TabId = 'overview' | 'marriage' | 'i751' | 'consular' | 'documents' | 'tips' | 'faq';

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

export default function ImmigrationGuidePage() {
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
    { id: 'consular', labelVi: 'Phỏng Vấn Lãnh Sự', labelEn: 'Consular Interview', icon: Plane },
    { id: 'documents', labelVi: 'Giấy Tờ Cần Thiết', labelEn: 'Required Documents', icon: FileText },
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {locale === 'vi' ? 'Loại Thẻ Xanh' : 'Green Card Types'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {locale === 'vi' ? immigrationData.greenCardTypes.conditional.nameVi : immigrationData.greenCardTypes.conditional.nameEn}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                  {immigrationData.greenCardTypes.conditional.code} - {immigrationData.greenCardTypes.conditional.duration} {locale === 'vi' ? 'năm' : 'years'}
                </p>
                <ul className="text-sm space-y-1">
                  {immigrationData.greenCardTypes.conditional.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
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
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {locale === 'vi' ? immigrationData.greenCardTypes.permanent.nameVi : immigrationData.greenCardTypes.permanent.nameEn}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                  {immigrationData.greenCardTypes.permanent.code} - {immigrationData.greenCardTypes.permanent.duration} {locale === 'vi' ? 'năm' : 'years'}
                </p>
                <ul className="text-sm space-y-1">
                  {immigrationData.greenCardTypes.permanent.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {locale === 'vi' ? 'Diện Bảo Lãnh' : 'Sponsorship Categories'}
        </h2>

        {/* Immediate Relatives */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {locale === 'vi' ? 'Người Thân Trực Tiếp (Không Giới Hạn Số Lượng)' : 'Immediate Relatives (No Quota Limits)'}
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Diện' : 'Category'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Người Bảo Lãnh' : 'Sponsor'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Người Được Bảo Lãnh' : 'Beneficiary'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Thời Gian' : 'Wait Time'}</th>
              </tr>
            </thead>
            <tbody>
              {immigrationData.sponsorshipCategories.immediate.map((cat) => (
                <tr key={cat.code} className="border-b border-gray-200 dark:border-slate-600">
                  <td className="px-4 py-3">
                    <Badge variant="success">{cat.code}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{locale === 'vi' ? cat.sponsor.vi : cat.sponsor.en}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{locale === 'vi' ? cat.beneficiary.vi : cat.beneficiary.en}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{cat.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Preference Categories */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {locale === 'vi' ? 'Diện Ưu Tiên (Có Giới Hạn Hàng Năm)' : 'Preference Categories (Annual Limits)'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Diện' : 'Category'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Người Bảo Lãnh' : 'Sponsor'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Người Được Bảo Lãnh' : 'Beneficiary'}</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-200">{locale === 'vi' ? 'Thời Gian Chờ' : 'Wait Time'}</th>
              </tr>
            </thead>
            <tbody>
              {immigrationData.sponsorshipCategories.preference.map((cat) => (
                <tr key={cat.code} className="border-b border-gray-200 dark:border-slate-600">
                  <td className="px-4 py-3">
                    <Badge variant="warning">{cat.code}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{locale === 'vi' ? cat.sponsor.vi : cat.sponsor.en}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{locale === 'vi' ? cat.beneficiary.vi : cat.beneficiary.en}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-medium">{cat.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Processing Times */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {locale === 'vi' ? 'Thời Gian Xử Lý' : 'Processing Times'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {immigrationData.processingTimes.map((item) => (
            <Card key={item.type} className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{item.time}</div>
              <div className="font-medium text-gray-900 dark:text-white">{item.type}</div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                {locale === 'vi' ? item.nameVi : item.nameEn}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">{resource.name}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );

  const renderQuestionSection = (
    categoryName: string,
    subcategories: typeof immigrationData.interviewQuestions.marriageGreenCard.subcategories
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
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {locale === 'vi' ? subcat.nameVi : subcat.nameEn}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {subcat.questions.length} {locale === 'vi' ? 'câu hỏi' : 'questions'}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
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
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {locale === 'vi' ? question.questionVi : question.questionEn}
                          </p>
                          {getImportanceBadge(question.importance)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                          {locale === 'vi' ? question.questionEn : question.questionVi}
                        </p>
                        {question.tips && (
                          <div className="mt-2 flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                            <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {locale === 'vi' ? immigrationData.requiredDocuments.marriageInterview.nameVi : immigrationData.requiredDocuments.marriageInterview.nameEn}
        </h2>

        <Card className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {locale === 'vi' ? 'Giấy Tờ Bắt Buộc' : 'Required Documents'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.marriageInterview.required.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            {locale === 'vi' ? 'Bằng Chứng Hôn Nhân Thật' : 'Bona Fide Marriage Evidence'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.marriageInterview.evidence.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Consular Interview Documents */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {locale === 'vi' ? immigrationData.requiredDocuments.consularInterview.nameVi : immigrationData.requiredDocuments.consularInterview.nameEn}
        </h2>

        <Card className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {locale === 'vi' ? 'Giấy Tờ Bắt Buộc' : 'Required Documents'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.consularInterview.required.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                {locale === 'vi' ? doc.vi : doc.en}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            {locale === 'vi' ? 'Giấy Tờ Tài Chính' : 'Financial Documents'}
          </h3>
          <ul className="space-y-2">
            {immigrationData.requiredDocuments.consularInterview.financial.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
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
            <CheckCircle2 className="w-6 h-6" />
            {locale === 'vi' ? 'NÊN LÀM' : "DO'S"}
          </h2>
          <ul className="space-y-3">
            {immigrationData.tips.do.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
            <XCircle className="w-6 h-6" />
            {locale === 'vi' ? 'KHÔNG NÊN' : "DON'TS"}
          </h2>
          <ul className="space-y-3">
            {immigrationData.tips.dont.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-slate-300">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
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
            <AlertTriangle className="w-6 h-6" />
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
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {locale === 'vi' ? item.questionVi : item.questionEn}
              </h3>
              <p className="text-gray-600 dark:text-slate-300">
                {locale === 'vi' ? item.answerVi : item.answerEn}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

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
            {immigrationData.interviewQuestions.i751RemovalOfConditions.questions.map((question, idx) => (
              <Card key={question.id}>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-slate-300">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {locale === 'vi' ? question.questionVi : question.questionEn}
                      </p>
                      {getImportanceBadge(question.importance)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {locale === 'vi' ? question.questionEn : question.questionVi}
                    </p>
                    {question.tips && (
                      <div className="mt-2 flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-700 dark:text-amber-300">
                          {locale === 'vi' ? question.tips.vi : question.tips.en}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'consular':
        return renderQuestionSection(
          locale === 'vi' ? 'Phỏng Vấn Lãnh Sự' : 'Consular Interview',
          immigrationData.interviewQuestions.consularInterview.subcategories
        );
      case 'documents':
        return renderDocuments();
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
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'vi' ? 'Trang chủ' : 'Home'}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === 'vi' ? 'Hướng Dẫn Phỏng Vấn Di Trú Mỹ' : 'US Immigration Interview Guide'}
        </h1>
        <p className="text-gray-600 dark:text-slate-400">
          {locale === 'vi'
            ? 'Tổng hợp 180+ câu hỏi phỏng vấn, giấy tờ cần thiết, và mẹo chuẩn bị'
            : '180+ interview questions, required documents, and preparation tips'}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="info">{immigrationData.metadata.totalQuestions} {locale === 'vi' ? 'câu hỏi' : 'questions'}</Badge>
          <Badge variant="success">{immigrationData.metadata.categories} {locale === 'vi' ? 'danh mục' : 'categories'}</Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {locale === 'vi' ? tab.labelVi : tab.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
