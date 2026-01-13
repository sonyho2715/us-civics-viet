'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string, lang?: 'en' | 'vi') => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const getVoice = useCallback((lang: 'en' | 'vi'): SpeechSynthesisVoice | null => {
    if (!isSupported) return null;

    const voices = window.speechSynthesis.getVoices();
    const langCode = lang === 'vi' ? 'vi' : 'en';

    // Try to find a voice for the exact language
    let voice = voices.find(v => v.lang.startsWith(langCode));

    // For English, prefer US English
    if (lang === 'en') {
      const usVoice = voices.find(v => v.lang === 'en-US');
      if (usVoice) voice = usVoice;
    }

    // For Vietnamese, try different Vietnamese voices
    if (lang === 'vi') {
      const viVoice = voices.find(v =>
        v.lang === 'vi-VN' || v.lang === 'vi' || v.lang.startsWith('vi')
      );
      if (viVoice) voice = viVoice;
    }

    return voice || null;
  }, [isSupported]);

  const speak = useCallback((text: string, lang: 'en' | 'vi' = 'en') => {
    if (!isSupported) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language
    utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';

    // Try to set a specific voice
    const voice = getVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    // Configure speech settings
    utterance.rate = lang === 'vi' ? 0.9 : 1.0; // Slightly slower for Vietnamese
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, getVoice]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
