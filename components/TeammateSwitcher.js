'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, Users } from 'lucide-react';
import MemberAvatar from './MemberAvatar';

export default function TeammateSwitcher({ currentSlug, members }) {
  const otherMembers = members.filter((m) => m.slug !== currentSlug);

  return (
    <section className="teammate-switcher-card">
      <div className="switcher-head">
        <div className="switcher-head-left">
          <span className="mini-label">OTHER MEMBERS</span>
          <h3>Switch Teammate Profile</h3>
        </div>
        <Link href="/#team" className="switcher-back-link">
          <span>All Team</span>
          <ChevronRight size={15} />
        </Link>
      </div>

      <div className="teammate-scroll-container">
        {otherMembers.map((m) => (
          <Link
            key={m.slug}
            href={`/member/${m.slug}`}
            className="teammate-mini-card"
          >
            <MemberAvatar member={m} size="sm" />
            <div className="teammate-mini-info">
              <strong>{m.name}</strong>
              <span>{m.shortRole}</span>
            </div>
            <ChevronRight size={14} className="teammate-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
