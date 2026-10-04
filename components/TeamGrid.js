'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import MemberModal from './MemberModal';
import MemberAvatar from './MemberAvatar';
import MemberFlipRow from './MemberFlipRow';

export default function TeamGrid({ members: initialMembers }) {
  const [members, setMembers] = useState(initialMembers || []);
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Update when initialMembers prop changes
    if (Array.isArray(initialMembers) && initialMembers.length > 0) {
      setMembers(initialMembers);
    }
  }, [initialMembers]);

  useEffect(() => {
    // Fetch logged-in user
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});

    // Sync latest dynamic members data from the unified store/API
    fetch('/api/public/members')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="team-list">
        {members.map((member, index) => {
          const isCurrentUser = currentUser && (currentUser.slug === member.slug || currentUser.id === member.id);

          return (
            <MemberFlipRow
              key={member.slug || index}
              member={member}
              index={index}
              isCurrentUser={isCurrentUser}
              onSelectModal={(m) => setSelected(m)}
            />
          );
        })}
      </div>
      <MemberModal
        member={selected}
        isCurrentUser={currentUser && selected && (currentUser.slug === selected.slug || currentUser.id === selected.id)}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
