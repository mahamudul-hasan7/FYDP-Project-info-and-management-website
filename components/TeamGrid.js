'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import MemberModal from './MemberModal';
import MemberAvatar from './MemberAvatar';

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
            <motion.button
              key={member.slug}
              className={`member-row ${member.placeholder ? 'placeholder-row' : ''} ${isCurrentUser ? 'logged-in-user-row' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ delay: index * 0.05, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelected(member)}
            >
              <div className="member-avatar-wrap">
                <MemberAvatar member={member} size="md" />
                {isCurrentUser && <span className="you-avatar-dot" title="Active Logged In Member" />}
              </div>
              <div className="member-row-copy">
                <div className="member-row-topline">
                  <div className="member-name-badge-group">
                    <h3>{member.name}</h3>
                    {isCurrentUser && (
                      <span className="you-active-badge">
                        <Sparkles size={11} />
                        <span>You</span>
                      </span>
                    )}
                  </div>
                  <span className="member-number">0{index + 1}</span>
                </div>
                <p>{member.shortRole}</p>
                <span className="member-tagline">{member.tagline}</span>
              </div>
              <span className="member-row-arrow"><ChevronRight size={20} /></span>
            </motion.button>
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
