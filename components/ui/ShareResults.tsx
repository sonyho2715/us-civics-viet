'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook } from 'lucide-react';
import { Button } from './Button';
import type { Locale } from '@/types';

interface ShareResultsProps {
  locale: Locale;
  score: number;
  total: number;
  passed: boolean;
}

export function ShareResults({ locale, score, total, passed }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const percentage = Math.round((score / total) * 100);

  const shareText = locale === 'vi'
    ? `Tôi vừa đạt ${score}/${total} (${percentage}%) trong bài thi quốc tịch Mỹ! ${passed ? '🎉 ĐẬU!' : 'Còn phải cố gắng thêm!'} Học cùng tôi tại:`
    : `I just scored ${score}/${total} (${percentage}%) on the U.S. Citizenship Practice Test! ${passed ? '🎉 PASSED!' : 'Still working on it!'} Study with me at:`;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === 'vi' ? 'Kết quả thi quốc tịch Mỹ' : 'U.S. Citizenship Test Results',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error, fall back to copy
        handleCopy();
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
    } catch (err) {
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
  };

  const handleFacebookShare = () => {
    const fbUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}&quote=${encodeURIComponent(shareText)}`, '_blank', 'width=550,height=420');
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={handleNativeShare}
        className="relative"
      >
        <Share2 className="w-4 h-4 mr-2" />
        {locale === 'vi' ? 'Chia sẻ' : 'Share'}
      </Button>

      {/* Share options dropdown */}
      {showOptions && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-3 min-w-[200px] z-50">
          <div className="space-y-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied
                ? locale === 'vi' ? 'Đã sao chép!' : 'Copied!'
                : locale === 'vi' ? 'Sao chép liên kết' : 'Copy Link'}
            </button>
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Twitter className="w-4 h-4 text-[#1DA1F2]" />
              Twitter
            </button>
            <button
              onClick={handleFacebookShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Facebook className="w-4 h-4 text-[#4267B2]" />
              Facebook
            </button>
          </div>

          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-gray-200 dark:border-slate-700 rotate-45" />
        </div>
      )}
    </div>
  );
}
