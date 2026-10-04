'use client';

import Link from 'next/link';
import { Code2, GraduationCap, Sparkles } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="unified-app-footer">
      <div className="footer-inner-card">
        <div className="footer-brand-meta">
          <div className="footer-meta-tag">
            <GraduationCap size={14} className="footer-meta-icon" />
            <span>UIU CSE • FYDP 2026</span>
          </div>
          <p className="footer-team-title">
            <strong>Team Random</strong> — Final Year Design Project Workspace
          </p>
        </div>

        <div className="footer-dev-col">
          <Link
            href="/developer"
            className="footer-dev-pill"
            title="View Developer Profile & Technical Architecture"
          >
            <span className="footer-dev-tag">
              <Code2 size={12} /> Lead Dev
            </span>
            <span className="footer-dev-name">Md Mahamudul Hasan</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
