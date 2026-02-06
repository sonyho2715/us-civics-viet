'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowLeft,
  FileText,
  Lightbulb,
  ClipboardList,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import n400DataRaw from '@/data/n400-form-guide.json';
import type { Locale } from '@/types';

interface N400Field {
  field_name_en: string;
  field_name_vi: string;
  explanation_en: string;
  explanation_vi: string;
  common_mistakes_en: string[];
  common_mistakes_vi: string[];
  tips_en: string;
  tips_vi: string;
}

interface N400Part {
  partNumber: number;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  fields: N400Field[];
}

interface N400Data {
  metadata: {
    formVersion: string;
    source: string;
    totalParts: number;
    note_en: string;
    note_vi: string;
  };
  parts: N400Part[];
}

const n400Data = n400DataRaw as N400Data;

const STORAGE_KEY = 'civics-n400-progress';

function getStoredProgress(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored) as number[]);
    }
  } catch {
    // ignore parse errors
  }
  return new Set();
}

function saveProgress(progress: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...progress]));
  } catch {
    // ignore storage errors
  }
}

export function N400HelperContent() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'vi';
  const [activePartNumber, setActivePartNumber] = useState(1);
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCompletedParts(getStoredProgress());
  }, []);

  const toggleField = (fieldKey: string) => {
    setExpandedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((k) => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const togglePartCompleted = useCallback((partNumber: number) => {
    setCompletedParts((prev) => {
      const next = new Set(prev);
      if (next.has(partNumber)) {
        next.delete(partNumber);
      } else {
        next.add(partNumber);
      }
      saveProgress(next);
      return next;
    });
  }, []);

  const activePart = n400Data.parts.find((p) => p.partNumber === activePartNumber);
  const progressPercent = (completedParts.size / n400Data.metadata.totalParts) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {locale === 'vi' ? 'Trang chu' : 'Home'}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {locale === 'vi' ? 'Huong Dan Don N-400' : 'N-400 Form Guide'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          {locale === 'vi'
            ? 'Huong dan tu ng muc don xin nhap quoc tich N-400 voi giai thich song ngu'
            : 'Field-by-field guide for the N-400 Application for Naturalization with bilingual explanations'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="info">
            {n400Data.metadata.source}
          </Badge>
          <Badge variant="default">
            {locale === 'vi' ? 'Phien ban' : 'Version'}: {n400Data.metadata.formVersion}
          </Badge>
          <Badge variant="success">
            {completedParts.size}/{n400Data.metadata.totalParts} {locale === 'vi' ? 'phan da xem' : 'parts reviewed'}
          </Badge>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          progress={progressPercent}
          color="green"
          size="md"
          showLabel
          label={locale === 'vi' ? 'Tien do xem don' : 'Review progress'}
        />
      </div>

      {/* Disclaimer */}
      <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {locale === 'vi'
              ? n400Data.metadata.note_vi
              : n400Data.metadata.note_en}
          </p>
        </div>
      </Card>

      {/* Tab Navigation - Horizontal Scrollable */}
      <div className="mb-8 overflow-x-auto">
        <div
          className="flex gap-2 min-w-max pb-2"
          role="tablist"
          aria-label={locale === 'vi' ? 'Cac phan cua don N-400' : 'N-400 form parts'}
        >
          {n400Data.parts.map((part) => {
            const isActive = activePartNumber === part.partNumber;
            const isCompleted = completedParts.has(part.partNumber);
            return (
              <button
                key={part.partNumber}
                onClick={() => setActivePartNumber(part.partNumber)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-part-${part.partNumber}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {isCompleted && (
                  <CheckCircle2
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-500'}`}
                    aria-hidden="true"
                  />
                )}
                <span>
                  {locale === 'vi' ? 'Phan' : 'Part'} {part.partNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Panel */}
      {activePart && (
        <div
          role="tabpanel"
          id={`panel-part-${activePart.partNumber}`}
          aria-labelledby={`part-${activePart.partNumber}`}
        >
          {/* Part Header */}
          <Card className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {locale === 'vi' ? 'Phan' : 'Part'} {activePart.partNumber}: {locale === 'vi' ? activePart.title_vi : activePart.title_en}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {locale === 'vi' ? activePart.title_en : activePart.title_vi}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {locale === 'vi' ? activePart.description_vi : activePart.description_en}
                  </p>
                </div>
              </div>
              <button
                onClick={() => togglePartCompleted(activePart.partNumber)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  completedParts.has(activePart.partNumber)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
                aria-label={
                  completedParts.has(activePart.partNumber)
                    ? (locale === 'vi' ? 'Bo danh dau da xem' : 'Mark as not reviewed')
                    : (locale === 'vi' ? 'Danh dau da xem' : 'Mark as reviewed')
                }
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                {completedParts.has(activePart.partNumber)
                  ? (locale === 'vi' ? 'Da xem' : 'Reviewed')
                  : (locale === 'vi' ? 'Danh dau da xem' : 'Mark reviewed')}
              </button>
            </div>
          </Card>

          {/* Fields */}
          <div className="space-y-4">
            {activePart.fields.map((field, fieldIdx) => {
              const fieldKey = `${activePart.partNumber}-${fieldIdx}`;
              const isExpanded = expandedFields.includes(fieldKey);

              return (
                <Card key={fieldKey} className="overflow-hidden" padding="none">
                  <button
                    onClick={() => toggleField(fieldKey)}
                    className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    aria-expanded={isExpanded}
                    aria-label={locale === 'vi' ? field.field_name_vi : field.field_name_en}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        {fieldIdx + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {locale === 'vi' ? field.field_name_vi : field.field_name_en}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {locale === 'vi' ? field.field_name_en : field.field_name_vi}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-slate-600 p-4 md:p-6 space-y-4">
                      {/* Explanation */}
                      <div>
                        <p className="text-gray-700 dark:text-gray-200">
                          {locale === 'vi' ? field.explanation_vi : field.explanation_en}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                          {locale === 'vi' ? field.explanation_en : field.explanation_vi}
                        </p>
                      </div>

                      {/* Common Mistakes */}
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                          <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm">
                            {locale === 'vi' ? 'Loi Thuong Gap' : 'Common Mistakes'}
                          </h4>
                        </div>
                        <ul className="space-y-1.5">
                          {(locale === 'vi' ? field.common_mistakes_vi : field.common_mistakes_en).map(
                            (mistake, mIdx) => (
                              <li
                                key={mIdx}
                                className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300"
                              >
                                <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                                {mistake}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                          <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                            {locale === 'vi' ? 'Meo' : 'Tips'}
                          </h4>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {locale === 'vi' ? field.tips_vi : field.tips_en}
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 italic">
                          {locale === 'vi' ? field.tips_en : field.tips_vi}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Navigation between parts */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setActivePartNumber((prev) => Math.max(1, prev - 1))}
              disabled={activePartNumber === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {locale === 'vi' ? 'Phan truoc' : 'Previous Part'}
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {activePartNumber} / {n400Data.metadata.totalParts}
            </span>

            <button
              onClick={() => setActivePartNumber((prev) => Math.min(n400Data.metadata.totalParts, prev + 1))}
              disabled={activePartNumber === n400Data.metadata.totalParts}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {locale === 'vi' ? 'Phan tiep' : 'Next Part'}
              <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
            </button>
          </div>

          {/* Info footer */}
          <Card className="mt-6 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'vi'
                  ? 'Noi dung nay chi mang tinh chat giao duc va khong thay the tu van phap ly. Luon tham van luat su di tru co giay phep cho tinh huong cu the cua ban.'
                  : 'This content is for educational purposes only and is not a substitute for legal advice. Always consult a licensed immigration attorney for your specific situation.'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
