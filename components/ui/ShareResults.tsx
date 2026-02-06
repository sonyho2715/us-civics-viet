'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, MessageCircle, X, ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { ShareProgressCard } from './ShareProgressCard';
import type { Locale } from '@/types';

interface ShareResultsProps {
  locale: Locale;
  score: number;
  total: number;
  passed: boolean;
  timeSpent?: number; // in seconds
  mode?: 'standard' | '65_20';
}

export function ShareResults({ locale, score, total, passed, timeSpent, mode = 'standard' }: ShareResultsProps) {
  const t = useTranslations('share');
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const percentage = Math.round((score / total) * 100);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format time spent
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmoji = () => {
    if (percentage === 100) return '🏆';
    if (passed) return '🎉';
    if (percentage >= 50) return '💪';
    return '📚';
  };

  const shareText = t('shareText', { emoji: getEmoji(), score, total, percentage, mode: mode === '65_20' ? ' (65/20)' : '', status: passed ? t('passed') : t('stillWorking'), time: timeSpent ? ` ${formatTime(timeSpent)}` : '' });

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://congdan.us';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('shareTitle'),
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error, fall back to dropdown
        setShowOptions(!showOptions);
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  const handleCopy = async () => {
    const textToCopy = `${shareText} ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'width=550,height=420');
    setShowOptions(false);
  };

  const handleFacebookShare = () => {
    const fbUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}&quote=${encodeURIComponent(shareText)}`, '_blank', 'width=550,height=420');
    setShowOptions(false);
  };

  const handleLinkedInShare = () => {
    const liUrl = encodeURIComponent(shareUrl);
    const liText = encodeURIComponent(shareText);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${liUrl}&summary=${liText}`, '_blank', 'width=550,height=420');
    setShowOptions(false);
  };

  const handleWhatsAppShare = () => {
    const waText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://wa.me/?text=${waText}`, '_blank');
    setShowOptions(false);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(t('emailSubject', { score, total }));
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowOptions(false);
  };

  const handleShareImage = () => {
    setShowOptions(false);
    setShowShareCard(true);
  };

  const shareOptions = [
    {
      id: 'image',
      label: t('shareAsImage'),
      icon: ImageIcon,
      color: 'text-purple-500',
      onClick: handleShareImage,
    },
    {
      id: 'copy',
      label: copied ? t('copied') : t('copyLink'),
      icon: copied ? Check : Copy,
      color: copied ? 'text-green-500' : 'text-gray-500',
      onClick: handleCopy,
    },
    {
      id: 'twitter',
      label: 'Twitter / X',
      icon: Twitter,
      color: 'text-[#1DA1F2]',
      onClick: handleTwitterShare,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'text-[#4267B2]',
      onClick: handleFacebookShare,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'text-[#0077B5]',
      onClick: handleLinkedInShare,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-[#25D366]',
      onClick: handleWhatsAppShare,
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      color: 'text-gray-600 dark:text-gray-400',
      onClick: handleEmailShare,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={handleNativeShare}
        className="relative"
        aria-expanded={showOptions}
        aria-haspopup="true"
      >
        <Share2 className="w-4 h-4 mr-2" />
        {t('share')}
      </Button>

      {/* Share options dropdown */}
      {showOptions && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-2 min-w-[220px] z-50"
          role="menu"
          aria-label={t('shareOptions')}
        >
          {/* Close button for accessibility */}
          <button
            onClick={() => setShowOptions(false)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('close')}
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>

          {/* Preview of what will be shared */}
          <div className="px-3 py-2 mb-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('preview')}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
              {shareText}
            </p>
          </div>

          <div className="space-y-1">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                role="menuitem"
              >
                <option.icon className={`w-4 h-4 ${option.color}`} />
                {option.label}
              </button>
            ))}
          </div>

          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-gray-200 dark:border-slate-700 rotate-45" />
        </div>
      )}

      {/* Share as Image Modal */}
      <ShareProgressCard
        isOpen={showShareCard}
        onClose={() => setShowShareCard(false)}
        options={{
          type: 'test_result',
          score,
          total,
          passed,
          locale,
        }}
      />
    </div>
  );
}
