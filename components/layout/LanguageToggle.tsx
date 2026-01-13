'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const switchLocale = (newLocale: string) => {
    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => switchLocale('vi')}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
          currentLocale === 'vi'
            ? 'bg-white text-blue-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
        aria-label="Switch to Vietnamese"
      >
        <span className="mr-1">🇻🇳</span>
        <span className="hidden sm:inline">VI</span>
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
          currentLocale === 'en'
            ? 'bg-white text-blue-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
        aria-label="Switch to English"
      >
        <span className="mr-1">🇺🇸</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
}
