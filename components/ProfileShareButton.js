'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export default function ProfileShareButton({ memberName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`profile-share-btn ${copied ? 'copied' : ''}`}
      title="Share / Copy Profile Link"
      aria-label="Share profile link"
    >
      {copied ? (
        <>
          <Check size={16} className="text-emerald" />
          <span className="share-text">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span className="share-text">Share</span>
        </>
      )}
    </button>
  );
}
