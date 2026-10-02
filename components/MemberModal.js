'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Code2, Linkedin, Mail, Phone, UserRound, X } from 'lucide-react';
import { useEffect } from 'react';
import MemberAvatar from './MemberAvatar';

export default function MemberModal({ member, onClose }) {
  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('modal-open');
    };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <motion.div
            className="member-sheet"
            initial={{ opacity: 0, y: 60, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 90 || velocity.y > 400) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" aria-hidden="true" />
            <button className="modal-close" onClick={onClose} aria-label="Close profile"><X size={18} /></button>

            <div className="sheet-profile">
              <MemberAvatar member={member} size="xl" />
              <div className="sheet-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="role-chip">{member.shortRole}</span>
                </div>
                <h2>{member.name}</h2>
                <p>{member.tagline}</p>
              </div>
            </div>

            <div className="sheet-meta-grid">
              <div><UserRound size={16} /><span>ID</span><strong>{member.id}</strong></div>
              <div>
                <Mail size={16} />
                <span>Email</span>
                <strong>
                  {member.email?.includes('@') ? (
                    <a href={`mailto:${member.email}`} style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                      {member.email}
                    </a>
                  ) : (
                    member.email
                  )}
                </strong>
              </div>
              {member.phone !== 'Not provided' && (
                <div>
                  <Phone size={16} />
                  <span>Phone</span>
                  <strong>
                    <a href={`tel:${member.phone}`} style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                      {member.phone}
                    </a>
                  </strong>
                </div>
              )}
            </div>

            <p className="sheet-about">{member.about}</p>

            <div className="skill-row">
              {member.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link className="primary-action" href={`/member/${member.slug}`} style={{ flex: 1 }}>
                <span>View Full Profile</span>
                <ArrowUpRight size={18} />
              </Link>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soft-action icon-only"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soft-action icon-only"
                  aria-label="GitHub Profile"
                  title="GitHub Profile"
                >
                  <Code2 size={18} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
