'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, RefreshCw, Sparkles, UserRound } from 'lucide-react';
import MemberAvatar from './MemberAvatar';
import UiuIdCard from './UiuIdCard';

export default function MemberFlipRow({
  member,
  index,
  isCurrentUser,
  onSelectModal
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  return (
    <motion.div
      className={`member-flip-container ${isCurrentUser ? 'logged-in-user-row' : ''} ${isFlipped ? 'is-flipped' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: index * 0.05, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`member-flip-card-inner ${isFlipped ? 'card-is-flipped' : ''}`}>
        {/* ========================================================
            FRONT SIDE: Clean Team Member Card with UIU Badge
            ======================================================== */}
        <div
          className={`member-flip-face member-flip-front ${member.placeholder ? 'placeholder-row' : ''}`}
          onClick={() => onSelectModal(member)}
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
                    <Sparkles size={10} />
                    <span>You</span>
                  </span>
                )}
              </div>
            </div>
            <p className="member-short-role">{member.shortRole}</p>
            <span className="member-tagline">{member.tagline}</span>
          </div>

          <div className="member-row-actions-col">
            <button
              type="button"
              className="member-row-badge-pill"
              onClick={handleBadgeClick}
              title="Click to flip to UIU Student ID"
            >
              <CreditCard size={11} />
              <span>UIU ID</span>
              <RefreshCw size={9} className="badge-spin-hint" />
            </button>
            <span className="member-row-arrow" title="View Profile">
              <ChevronRight size={18} />
            </span>
          </div>
        </div>

        {/* ========================================================
            BACK SIDE: 3D UIU Student ID Card Replica
            ======================================================== */}
        <div
          className="member-flip-face member-flip-back"
          onClick={() => onSelectModal(member)}
          title="Click to view full member profile"
        >
          {/* Top-Right Flip Back Button */}
          <button
            type="button"
            className="member-row-badge-pill back-flip-btn"
            onClick={handleBadgeClick}
            title="Flip back to Member Profile"
          >
            <UserRound size={11} />
            <span>Profile</span>
            <RefreshCw size={9} className="badge-spin-hint" />
          </button>

          {/* Centered ID Card */}
          <div className="flip-back-id-wrapper">
            <UiuIdCard
              member={member}
              allowFlip={false}
              showHolder={false}
              showLanyard={false}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
