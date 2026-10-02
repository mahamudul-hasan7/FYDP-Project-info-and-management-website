'use client';

import { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';

export default function MemberAvatar({ member, size = 'md', className = '' }) {
  // Fixed permanent Crown Avatar for System Admin
  const isAdminAvatar =
    member?.slug === 'system-admin' ||
    member?.username === 'admin' ||
    member?.name === 'System Administrator' ||
    member?.isAdminAvatar;

  if (isAdminAvatar) {
    const iconSizes = {
      xs: 12,
      sm: 16,
      md: 26,
      lg: 32,
      xl: 42,
      xxl: 54
    };
    const iconSize = iconSizes[size] || 26;

    return (
      <div
        className={`member-avatar admin-system-avatar style-crown avatar-${size} ${className}`}
        aria-label="System Administrator Crown Avatar"
        title="Super Admin"
      >
        <Crown size={iconSize} className="admin-avatar-icon-svg" />
      </div>
    );
  }

  const getCandidateUrls = (m) => {
    if (!m) return [];
    const candidates = [];
    if (m.image) candidates.push(m.image);
    if (m.slug) {
      candidates.push(`/members/${m.slug}.jpg`);
      candidates.push(`/members/${m.slug}.png`);
      candidates.push(`/members/${m.slug}.jpeg`);
      const noHyphen = m.slug.replace(/-/g, '');
      candidates.push(`/members/${noHyphen}.jpeg`);
      candidates.push(`/members/${noHyphen}.jpg`);
      candidates.push(`/members/${noHyphen}.png`);
    }
    return Array.from(new Set(candidates));
  };

  const [candidateList, setCandidateList] = useState(() => getCandidateUrls(member));
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    const list = getCandidateUrls(member);
    setCandidateList(list);
    setCandidateIndex(0);
  }, [member?.image, member?.slug]);

  const currentSrc = candidateList[candidateIndex];

  const handleError = () => {
    if (candidateIndex + 1 < candidateList.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setCandidateIndex(candidateList.length);
    }
  };

  if (currentSrc && candidateIndex < candidateList.length && !member?.placeholder) {
    return (
      <div className={`member-avatar avatar-${size} ${className}`} aria-label={`${member?.name || 'Member'} profile photo`}>
        <img
          src={currentSrc}
          alt={member?.name || 'Member'}
          loading="eager"
          decoding="async"
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
