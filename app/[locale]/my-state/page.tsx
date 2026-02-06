'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Building2,
  Landmark,
  Users,
  Globe,
  FileText,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  User,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDynamicOfficials } from '@/hooks/useDynamicOfficials';
import { US_STATES, type Locale, type StateCode } from '@/types';
import stateResourcesData from '@/data/state-resources.json';

interface StateResource {
  name: string;
  capital: string;
  governor: string;
  senators: string[];
  representative_count: number;
  government_website: string;
  uscis_office: string;
}

const stateResources = stateResourcesData.states as Record<string, StateResource>;

// Questions that depend on the user's state
const STATE_DEPENDENT_QUESTIONS = [
  {
    number: 23,
    question_en: 'Name your U.S. Representative.',
    question_vi: 'Hay ke ten Dan bieu lien bang cua ban.',
    type: 'representative',
  },
  {
    number: 57,
    question_en: 'What are the two senators for your state?',
    question_vi: 'Hai Thuong nghi si cua tieu bang ban la ai?',
    type: 'state_senator',
  },
  {
    number: 61,
    question_en: 'Who is the Governor of your state now?',
    question_vi: 'Thong doc tieu bang cua ban hien nay la ai?',
    type: 'governor',
  },
  {
    number: 62,
    question_en: 'What is the capital of your state?',
    question_vi: 'Thu phu cua tieu bang ban la gi?',
    type: 'state_capital',
  },
];

export default function MyStatePage() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'vi';
  const isVietnamese = locale === 'vi';
  const [mounted, setMounted] = useState(false);

  const { state: userState, setState: setUserState } = useSettingsStore();
  const { getStateData } = useDynamicOfficials(userState);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const stateData = getStateData(userState);
  const resourceData = stateResources[userState];
  const isDC = userState === 'DC';

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserState(e.target.value as StateCode);
  };

  // Get the answer for each state-specific question
  const getQuestionAnswer = (type: string): string => {
    if (!stateData || !resourceData) return isVietnamese ? 'Khong co du lieu' : 'No data available';
    switch (type) {
      case 'representative':
        if (isDC) return isVietnamese ? 'DC khong co dan bieu co quyen bau' : 'DC has no voting representative';
        return isVietnamese
          ? `Tim dan bieu tai house.gov (${resourceData.representative_count} dan bieu)`
          : `Find your representative at house.gov (${resourceData.representative_count} representatives)`;
      case 'state_senator':
        if (isDC) return isVietnamese ? 'DC khong co Thuong nghi si' : 'DC has no senators';
        return resourceData.senators.join(', ');
      case 'governor':
        return stateData.governor;
      case 'state_capital':
        return stateData.capital;
      default:
        return '';
    }
  };

  const stateName = resourceData?.name || userState;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          {isVietnamese ? 'Tieu Bang Cua Toi' : 'My State'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isVietnamese
            ? 'Thong tin tieu bang va cau hoi thi quoc tich lien quan'
            : 'State information and related citizenship test questions'}
        </p>
      </div>

      {/* State Selector */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <label
            htmlFor="state-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {isVietnamese ? 'Chon tieu bang cua ban' : 'Select your state'}
          </label>
          <div className="relative max-w-md">
            <select
              id="state-select"
              value={userState}
              onChange={handleStateChange}
              className="w-full appearance-none bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isVietnamese
              ? 'Tieu bang nay se duoc luu cho cac cau hoi phu thuoc vi tri'
              : 'This state will be saved for location-dependent questions'}
          </p>
        </CardContent>
      </Card>

      {/* State Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Governor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {isVietnamese ? 'Thong Doc' : 'Governor'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {stateData?.governor || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isVietnamese ? `Thong doc tieu bang ${stateName}` : `Governor of ${stateName}`}
            </p>
          </CardContent>
        </Card>

        {/* Capital */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              {isVietnamese ? 'Thu Phu' : 'State Capital'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {stateData?.capital || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isVietnamese ? `Thu phu cua ${stateName}` : `Capital of ${stateName}`}
            </p>
          </CardContent>
        </Card>

        {/* Senators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              {isVietnamese ? 'Thuong Nghi Si' : 'U.S. Senators'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDC ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {isVietnamese
                  ? 'DC khong co dai dien bau cu tai Thuong Vien'
                  : 'DC has no voting representation in the Senate'}
              </p>
            ) : (
              <div className="space-y-2">
                {resourceData?.senators.map((senator, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge
                      variant={
                        senator.includes('(R)')
                          ? 'error'
                          : senator.includes('(D)')
                          ? 'info'
                          : 'default'
                      }
                      size="sm"
                    >
                      {senator.includes('(R)') ? 'R' : senator.includes('(D)') ? 'D' : 'I'}
                    </Badge>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {senator.replace(/ \([RDI]\)/, '')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Representatives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              {isVietnamese ? 'Dan Bieu Lien Bang' : 'U.S. Representatives'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDC ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {isVietnamese
                  ? 'DC co 1 dai bieu khong co quyen bau'
                  : 'DC has 1 non-voting delegate'}
              </p>
            ) : (
              <>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {resourceData?.representative_count || 0}{' '}
                  {isVietnamese ? 'Dan bieu' : 'Representatives'}
                </p>
                <a
                  href="https://www.house.gov/representatives/find-your-representative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isVietnamese ? 'Tim dan bieu cua ban tai house.gov' : 'Find your representative at house.gov'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </CardContent>
        </Card>

        {/* Government Website */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              {isVietnamese ? 'Trang Web Chinh Phu' : 'Government Website'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resourceData?.government_website ? (
              <a
                href={resourceData.government_website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {resourceData.government_website.replace('https://', '')}
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">N/A</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isVietnamese
                ? `Trang web chinh thuc cua ${stateName}`
                : `Official website of ${stateName}`}
            </p>
          </CardContent>
        </Card>

        {/* USCIS Office */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
              {isVietnamese ? 'Van Phong USCIS' : 'USCIS Office'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {resourceData?.uscis_office || 'N/A'}
            </p>
            <a
              href="https://www.uscis.gov/about-us/find-a-uscis-office"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isVietnamese ? 'Tim van phong USCIS gan ban' : 'Find USCIS offices near you'}
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* State-Specific Civics Questions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            {isVietnamese
              ? 'Cau Hoi Phu Thuoc Tieu Bang'
              : 'State-Specific Civics Questions'}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isVietnamese
              ? 'Nhung cau hoi nay co cau tra loi phu thuoc vao tieu bang cua ban'
              : 'These questions have answers that depend on your state'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {STATE_DEPENDENT_QUESTIONS.map((q) => {
              const answer = getQuestionAnswer(q.type);
              return (
                <div
                  key={q.number}
                  className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="info" size="md" className="flex-shrink-0 mt-0.5">
                      #{q.number}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {isVietnamese ? q.question_vi : q.question_en}
                      </p>
                      {!isVietnamese && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {q.question_vi}
                        </p>
                      )}
                      {isVietnamese && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {q.question_en}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          {isVietnamese ? 'Tra loi:' : 'Answer:'}
                        </span>
                        <span className="text-sm text-green-800 dark:text-green-300 font-semibold">
                          {answer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {isVietnamese ? 'Lien Ket Huu Ich' : 'Useful Links'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resourceData?.government_website && (
              <a
                href={resourceData.government_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Globe className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {isVietnamese ? `Truy cap ${stateName}.gov` : `Visit ${stateName}.gov`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {resourceData.government_website}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-auto" />
              </a>
            )}
            <a
              href="https://www.house.gov/representatives/find-your-representative"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Users className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {isVietnamese ? 'Tim dan bieu tai house.gov' : 'Find your representative at house.gov'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  house.gov
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-auto" />
            </a>
            <a
              href="https://www.senate.gov/senators/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Landmark className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {isVietnamese ? 'Tim thuong nghi si tai senate.gov' : 'Find your senators at senate.gov'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  senate.gov
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-auto" />
            </a>
            <a
              href="https://www.uscis.gov/about-us/find-a-uscis-office"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {isVietnamese ? 'Tim van phong USCIS' : 'Find USCIS offices'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  uscis.gov
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-auto" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
