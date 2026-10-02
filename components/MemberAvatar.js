'use client';

import { useState, useEffect } from 'react';

export default function MemberAvatar({ member, size = 'md', className = '' }) {
  const [imgSrc, setImgSrc] = useState(member?.image || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(member?.image || null);
    setFailed(false);
  }, [member?.image, member?.slug]);

  const handleError = () => {
    if (!imgSrc) {
      setFailed(true);
      return;
    }
    // If .jpg failed, try .png
    if (imgSrc.endsWith('.jpg')) {
      setImgSrc(imgSrc.replace('.jpg', '.png'));
    } else if (imgSrc.endsWith('.png')) {
      setImgSrc(imgSrc.replace('.png', '.jpg'));
    } else {
      setFailed(true);
    }
  };

  if (imgSrc && !failed && !member?.placeholder) {
    return (
      <div className={`member-avatar avatar-${size} ${className}`} aria-label={`${member?.name || 'Member'} profile photo`}>
        <img
          src={imgSrc}
          alt={member?.name || 'Member'}
          onError={handleError}
          style={{
            objectPosition: member?.imagePosition || 'center center',
            objectFit: member?.imageFit || 'cover'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`member-avatar avatar-${size} ${className}`} aria-label={`${member?.name || 'Member'} avatar`}>
      <span>{member?.initials || 'TR'}</span>
    </div>
  );
}
