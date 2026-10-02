'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import MemberModal from './MemberModal';
import MemberAvatar from './MemberAvatar';

export default function TeamGrid({ members }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="team-list">
        {members.map((member, index) => (
          <motion.button
            key={member.slug}
            className={`member-row ${member.placeholder ? 'placeholder-row' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ delay: index * 0.055, duration: 0.38 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setSelected(member)}
          >
            <MemberAvatar member={member} size="md" />
            <div className="member-row-copy">
              <div className="member-row-topline">
                <h3>{member.name}</h3>
                <span className="member-number">0{index + 1}</span>
              </div>
              <p>{member.shortRole}</p>
              <span className="member-tagline">{member.tagline}</span>
            </div>
            <span className="member-row-arrow"><ChevronRight size={20} /></span>
          </motion.button>
        ))}
      </div>
      <MemberModal member={selected} onClose={() => setSelected(null)} />
    </>
  );
}
