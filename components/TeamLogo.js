'use client';

import { useState } from 'react';

export default function TeamLogo({ size = 42, className = '' }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`app-brand-mark ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: failed ? 'var(--text)' : 'transparent',
        padding: failed ? '0' : '2px',
        overflow: 'hidden'
      }}
      aria-label="Team Random Logo"
    >
      {!failed ? (
        <img
          src="/team-logo.png"
          alt="Team Random Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            borderRadius: 'inherit'
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span>TR</span>
      )}
    </div>
  );
}
