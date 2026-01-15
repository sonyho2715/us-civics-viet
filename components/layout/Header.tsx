'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Menu,
  X,
  BookOpen,
  FileQuestion,
  Layers,
  Star,
  Plane,
  FolderOpen,
  ChevronDown,
  Trophy,
  FileText,
  MessageSquare,
  Users,
} from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const params = useParams();
  const locale = params.locale as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: `/${locale}/study`, label: t('study'), icon: BookOpen },
    { href: `/${locale}/practice`, label: t('practice'), icon: FileQuestion },
    { href: `/${locale}/flashcards`, label: t('flashcards'), icon: Layers },
    { href: `/${locale}/65-20`, label: t('senior'), icon: Star },
    { href: `/${locale}/immigration`, label: t('immigration'), icon: Plane },
  ];

  const resourceItems = [
    { href: `/${locale}/resources/stories`, label: t('stories'), icon: Trophy },
    { href: `/${locale}/resources/n400`, label: t('n400'), icon: FileText },
    { href: `/${locale}/resources/interview`, label: t('interview'), icon: MessageSquare },
    { href: `/${locale}/resources/community`, label: t('community'), icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white hidden sm:inline-block">
              {locale === 'vi' ? 'Công Dân Mỹ' : 'U.S. Citizenship'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  'dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div ref={resourcesRef} className="relative">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  'dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800',
                  isResourcesOpen && 'bg-gray-100 dark:bg-slate-800'
                )}
              >
                <FolderOpen className="w-4 h-4" />
                {t('resources')}
                <ChevronDown className={cn('w-3 h-3 transition-transform', isResourcesOpen && 'rotate-180')} />
              </button>

              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsResourcesOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                        'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                        'dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700'
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                    'dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}

              {/* Resources Section */}
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  {t('resources')}
                </div>
                {resourceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                      'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                      'dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
