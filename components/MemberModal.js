'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { ArrowUpRight, Code2, Globe, Linkedin, Mail, Phone, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import MemberAvatar from './MemberAvatar';
import { maskStudentId } from '../lib/format';

export default function MemberModal({ member, isCurrentUser, onClose }) {
  const dragControls = useDragControls();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 860 : false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 860);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const modalVariants = {
    hidden: isMobile
      ? { opacity: 0.8, y: '100%' }
      : { opacity: 0, scale: 0.95, y: 20 },
    visible: isMobile
      ? { opacity: 1, y: 0 }
      : { opacity: 1, scale: 1, y: 0 },
    exit: isMobile
      ? { opacity: 0.8, y: '100%' }
      : { opacity: 0, scale: 0.95, y: 20 }
  };

  const modalTransition = isMobile
    ? {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.75
      }
    : {
        type: 'spring',
        damping: 26,
        stiffness: 320,
        mass: 0.9
      };

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
          onClick={onClose}
        >
          <motion.div
            className={`member-sheet ${isCurrentUser ? 'modal-user-self' : ''}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={modalTransition}
            drag={isMobile ? 'y' : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.75 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 60 || velocity.y > 220) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="sheet-handle-zone"
              onPointerDown={(e) => {
                if (isMobile) dragControls.start(e);
              }}
              style={{ touchAction: 'none' }}
            >
              <div className="sheet-handle" aria-hidden="true" />
            </div>

            <div
              className="sheet-profile"
              onPointerDown={(e) => {
                if (isMobile && e.pointerType === 'touch') {
                  dragControls.start(e);
                }
              }}
            >
              <MemberAvatar member={member} size="xl" />
              <div className="sheet-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="role-chip">{member.shortRole}</span>
                  {isCurrentUser && (
                    <span className="modal-you-pill">
                      <span>⚡ You</span>
                    </span>
                  )}
                </div>
                <h2>{member.name}</h2>
                <p>{member.tagline}</p>
              </div>
            </div>

            {isCurrentUser && (
              <Link className="modal-edit-quick-bar" href="/portal" onClick={onClose}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pulsing-circle" />
                  <strong>You are viewing your own profile</strong>
                </div>
                <span>Edit Profile ➔</span>
              </Link>
            )}

            <div className="sheet-meta-grid">
              <div>
                <UserRound size={16} />
                <span>ID</span>
                <strong>{member.id}</strong>
              </div>
              {member.privacy?.email !== false && member.email && (
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
              )}
              {member.privacy?.phone === true && member.phone && member.phone !== 'Not provided' && (
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

            {/* Social & Contact Links (Row Above) */}
            {((member.privacy?.phone === true && member.phone && member.phone !== 'Not provided') ||
              (member.privacy?.linkedin !== false && member.linkedin) ||
              (member.privacy?.github !== false && member.github) ||
              (Array.isArray(member.customLinks) && member.customLinks.some((l) => l.isPublic !== false && l.url))) && (
              <div className="modal-links-row" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {member.privacy?.phone === true && member.phone && member.phone !== 'Not provided' && (
                  <a
                    href={`tel:${member.phone}`}
                    className="soft-action"
                    style={{ flex: 1, minWidth: '70px', height: '42px', justifyContent: 'center', padding: '0 12px', gap: '6px' }}
                    aria-label={`Call ${member.name}`}
                    title={`Call ${member.phone}`}
                  >
                    <Phone size={15} />
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>Call</span>
                  </a>
                )}
                {member.privacy?.linkedin !== false && member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-action"
                    style={{ flex: 1, minWidth: '80px', height: '42px', justifyContent: 'center', padding: '0 12px', gap: '6px' }}
                    aria-label="LinkedIn Profile"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={15} />
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>LinkedIn</span>
                  </a>
                )}
                {member.privacy?.github !== false && member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-action"
                    style={{ flex: 1, minWidth: '80px', height: '42px', justifyContent: 'center', padding: '0 12px', gap: '6px' }}
                    aria-label="GitHub Profile"
                    title="GitHub Profile"
                  >
                    <Code2 size={15} />
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>GitHub</span>
                  </a>
                )}
                {Array.isArray(member.customLinks) &&
                  member.customLinks
                    .filter((l) => l.isPublic !== false && l.url)
                    .map((link, idx) => (
                      <a
                        key={link.id || idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="soft-action"
                        style={{ flex: 1, minWidth: '80px', height: '42px', justifyContent: 'center', padding: '0 12px', gap: '6px' }}
                        aria-label={link.title || 'Website'}
                        title={link.title ? `${link.title}: ${link.url}` : link.url}
                      >
                        <Globe size={15} />
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>{link.title || 'Web'}</span>
                      </a>
                    ))}
              </div>
            )}

            {/* View Full Profile (Full Width Button) */}
            <Link
              className="primary-action"
              href={`/member/${member.slug}`}
              style={{ width: '100%', justifyContent: 'center', height: '48px', marginTop: '6px' }}
            >
              <span>View Full Profile</span>
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
