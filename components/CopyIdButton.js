'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyIdButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-id-pill ${copied ? 'copied' : ''}`}
      title={`Click to copy ${label}`}
      aria-label={`Copy ${label}`}
    >
      <span>{text}</span>
      {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
    </button>
  );
}
