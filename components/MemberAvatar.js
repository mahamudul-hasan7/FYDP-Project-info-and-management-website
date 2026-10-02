'use client';

import { useState, useEffect } from 'react';

export default function MemberAvatar({ member, size = 'md', className = '' }) {
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
