'use client';

import { useParams } from 'next/navigation';

export function SkipLinks() {
  const params = useParams();
  const locale = params.locale as string;

  const links = [
    {
      id: 'main-content',
      label: locale === 'vi' ? 'Bỏ qua đến nội dung chính' : 'Skip to main content',
    },
    {
      id: 'navigation',
      label: locale === 'vi' ? 'Bỏ qua đến điều hướng' : 'Skip to navigation',
    },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-[100] p-2 bg-white dark:bg-slate-900">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
