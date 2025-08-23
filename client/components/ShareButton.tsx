'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"; // if you're using shadcn/ui
import { Share2, Check } from 'lucide-react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: 'Do this quest and earn!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="flex items-center gap-2 bg-brand-dark hover:bg-brand-dark/90 text-white"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
}
