'use client';

import { useState, useEffect, useCallback } from 'react';
import { Share2, Download, Copy, Check, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { generateShareCard, type ShareCardOptions } from '@/lib/share-card';

interface ShareProgressCardProps {
  isOpen: boolean;
  onClose: () => void;
  options: ShareCardOptions;
}

export function ShareProgressCard({ isOpen, onClose, options }: ShareProgressCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const isVietnamese = options.locale === 'vi';

  const generate = useCallback(async () => {
    setLoading(true);
    setImageUrl(null);
    try {
      const generatedBlob = await generateShareCard(options);
      setBlob(generatedBlob);
      const url = URL.createObjectURL(generatedBlob);
      setImageUrl(url);
    } catch (err) {
      console.error('Failed to generate share card:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    if (isOpen) {
      generate();
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleShare = async () => {
    if (!blob) return;

    const file = new File([blob], 'congdan-us-progress.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: isVietnamese ? 'Tien do hoc tap - congdan.us' : 'Study Progress - congdan.us',
          files: [file],
        });
        return;
      } catch {
        // User cancelled or error - fall through to copy
      }
    }

    // Fallback: copy link
    await handleCopyLink();
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'congdan-us-progress.png';
    a.click();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://congdan.us');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = 'https://congdan.us';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVietnamese ? 'Chia Se Tien Do' : 'Share Progress'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Image Preview */}
        <div className="relative bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden aspect-[1200/630] flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">
                {isVietnamese ? 'Dang tao hinh...' : 'Generating image...'}
              </span>
            </div>
          )}
          {imageUrl && !loading && (
            <img
              src={imageUrl}
              alt={isVietnamese ? 'The chia se tien do' : 'Share progress card'}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleShare}
            disabled={!blob || loading}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isVietnamese ? 'Chia Se' : 'Share'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!imageUrl || loading}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isVietnamese ? 'Tai Xuong' : 'Download'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleCopyLink}
            disabled={loading}
            className="flex-1"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied
              ? (isVietnamese ? 'Da sao chep!' : 'Copied!')
              : (isVietnamese ? 'Sao chep link' : 'Copy Link')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
