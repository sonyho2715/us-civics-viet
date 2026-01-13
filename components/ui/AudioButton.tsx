'use client';

import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

interface AudioButtonProps {
  text: string;
  lang?: 'en' | 'vi';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'ghost';
}

export function AudioButton({
  text,
  lang = 'en',
  size = 'md',
  className,
  variant = 'default',
}: AudioButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  };

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variants = {
    default: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50',
    ghost: 'text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700',
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200',
        sizes[size],
        variants[variant],
        isSpeaking && 'ring-2 ring-blue-400 dark:ring-blue-500',
        className
      )}
      title={isSpeaking ? 'Stop audio' : `Play audio (${lang === 'vi' ? 'Vietnamese' : 'English'})`}
      aria-label={isSpeaking ? 'Stop audio' : `Play audio in ${lang === 'vi' ? 'Vietnamese' : 'English'}`}
    >
      {isSpeaking ? (
        <VolumeX className={cn(iconSizes[size], 'animate-pulse')} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </button>
  );
}

// Combined audio buttons for both languages
interface BilingualAudioProps {
  textEn: string;
  textVi: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BilingualAudio({
  textEn,
  textVi,
  size = 'sm',
  className,
}: BilingualAudioProps) {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  if (!isSupported) {
    return null;
  }

  const handleSpeak = (text: string, lang: 'en' | 'vi') => {
    if (isSpeaking) {
      stop();
    }
    // Small delay to ensure previous speech is canceled
    setTimeout(() => speak(text, lang), 50);
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => handleSpeak(textEn, 'en')}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        title="Play in English"
      >
        <Volume2 className={iconSizes[size]} />
        <span>EN</span>
      </button>
      <button
        onClick={() => handleSpeak(textVi, 'vi')}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        title="Phát tiếng Việt"
      >
        <Volume2 className={iconSizes[size]} />
        <span>VI</span>
      </button>
    </div>
  );
}
