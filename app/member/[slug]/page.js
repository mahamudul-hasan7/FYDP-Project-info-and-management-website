import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
  Target,
  UserRound
} from 'lucide-react';
import ThemeToggle from '../../../components/ThemeToggle';
import MemberAvatar from '../../../components/MemberAvatar';
import CopyIdButton from '../../../components/CopyIdButton';
import TeammateSwitcher from '../../../components/TeammateSwitcher';
import MobileDock from '../../../components/MobileDock';
import { getMemberBySlug } from '../../../lib/store';
import { getMember, members } from '../../../data/members';

export function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export default async function MemberPage({ params }) {
  const { slug } = await params;
  const member = getMemberBySlug(slug) || getMember(slug);
  if (!member) notFound();


  return (
    <main className="app-shell profile-screen">
      {/* Top Header Bar (Clean, without share button) */}
      <header className="topbar profile-topbar">
        <Link className="profile-back-btn" href="/#team" aria-label="Back to team">
          <ArrowLeft size={18} />
          <span className="back-text">Back to Team</span>
        </Link>
        
        <div className="profile-top-title">
          <span>{member.name}</span>
        </div>

        <div className="profile-top-actions">
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Profile Banner */}
      <section className="profile-hero-card">
        <div className="profile-hero-glow" aria-hidden="true" />
        
        <div className="profile-hero-main">
          <div className="profile-avatar-wrapper">
            <MemberAvatar member={member} size="xxl" className="profile-hero-avatar" />
            <span className="profile-status-indicator" title="Active Team Member">
              <span className="status-dot-inner" />
              Active Member
            </span>
          </div>

          <div className="profile-header-info">
            <div className="profile-badge-row">
              <span className="role-chip prominent">{member.role}</span>
              <span className="hud-pill hud-status">
                <GraduationCap size={13} />
                CSE • UIU
              </span>
            </div>

            <h1 className="profile-name">{member.name}</h1>
            <p className="profile-tagline">“{member.tagline}”</p>

            {/* Quick Action Matrix */}
            <div className="profile-action-matrix">
              {member.privacy?.email !== false && member.email?.includes('@') && (
                <a
                  href={`mailto:${member.email}`}
                  className="matrix-btn primary"
                  aria-label={`Send email to ${member.name}`}
                >
                  <Mail size={16} />
                  <span>Send Email</span>
                </a>
              )}

              {member.privacy?.phone !== false && member.phone && member.phone !== 'Not provided' && (
                <a
                  href={`tel:${member.phone}`}
                  className="matrix-btn"
                  aria-label={`Call ${member.name}`}
                  title={`Call ${member.phone}`}
                >
                  <Phone size={16} />
                  <span>Call Phone</span>
                </a>
              )}

              {member.privacy?.linkedin !== false && member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-btn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </a>
              )}

              {member.privacy?.github !== false && member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-btn"
                  aria-label="GitHub Profile"
                >
                  <Code2 size={16} />
                  <span>GitHub</span>
                </a>
              )}

              {/* Dynamic Public Custom Links */}
              {Array.isArray(member.customLinks) &&
                member.customLinks
                  .filter((l) => l.isPublic !== false && l.url)
                  .map((link, idx) => (
                    <a
                      key={link.id || idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="matrix-btn"
                      aria-label={link.title || 'Website Link'}
                      title={link.url}
                    >
                      <Globe size={16} />
                      <span>{link.title || 'Website'}</span>
                    </a>
                  ))}
            </div>
          </div>
        </div>

        {/* Grouped Information List (iOS Style with 1-Click Copy) */}
        <div className="profile-grouped-meta">
          <div className="meta-group-row">
            <div className="meta-row-left">
              <span className="meta-row-icon"><UserRound size={16} /></span>
              <span className="meta-row-label">Student ID</span>
            </div>
            <div className="meta-row-value">
              {member.id && member.id !== 'To be added' ? (
                <CopyIdButton text={member.id} label="Student ID" />
              ) : (
                <span className="text-muted">{member.id}</span>
              )}
            </div>
          </div>

          {member.privacy?.email !== false && (
            <div className="meta-group-row">
              <div className="meta-row-left">
                <span className="meta-row-icon"><Mail size={16} /></span>
                <span className="meta-row-label">Institutional Email</span>
              </div>
              <div className="meta-row-value">
                {member.email?.includes('@') ? (
                  <a href={`mailto:${member.email}`} className="email-link">
                    {member.email}
                  </a>
                ) : (
                  <span className="text-muted">{member.email}</span>
                )}
              </div>
            </div>
          )}

          {member.privacy?.phone !== false && member.phone && member.phone !== 'Not provided' && (
            <div className="meta-group-row">
              <div className="meta-row-left">
                <span className="meta-row-icon"><Phone size={16} /></span>
                <span className="meta-row-label">Contact Phone</span>
              </div>
              <div className="meta-row-value">
                <a href={`tel:${member.phone}`} className="email-link">
                  {member.phone}
                </a>
              </div>
            </div>
          )}

          <div className="meta-group-row">
            <div className="meta-row-left">
              <span className="meta-row-icon"><Briefcase size={16} /></span>
              <span className="meta-row-label">Specialization</span>
            </div>
            <span className="meta-row-value accent-text">{member.shortRole}</span>
          </div>

          <div className="meta-group-row">
            <div className="meta-row-left">
              <span className="meta-row-icon"><GraduationCap size={16} /></span>
              <span className="meta-row-label">Affiliation</span>
            </div>
            <span className="meta-row-value">UIU FYDP • Team Random</span>
          </div>
        </div>
      </section>

      {/* Main Bento Profile Content */}
      <section className="profile-content-grid">
        {/* Role Overview */}
        <article className="content-card wide-card highlight-card">
          <div className="card-header-badge">
            <Sparkles size={16} className="text-orange" />
            <span className="mini-label">ROLE OVERVIEW</span>
          </div>
          <h2>About the Role</h2>
          <p className="lead-text">{member.about}</p>
        </article>

        {/* Deliverables & Responsibilities */}
        <article className="content-card">
          <div className="card-header-badge">
            <CheckCircle2 size={16} className="text-emerald" />
            <span className="mini-label">RESPONSIBILITIES</span>
          </div>
          <h2>Key Deliverables</h2>
          <p className="card-subtext">Direct contributions to FYDP milestones & artifacts</p>
          <ul className="responsibility-list">
            {member.responsibilities.map((item) => (
              <li key={item}>
                <span className="check-bullet"><CheckCircle2 size={15} /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Skills & Strengths */}
        <article className="content-card">
          <div className="card-header-badge">
            <Code2 size={16} className="text-orange" />
            <span className="mini-label">EXPERTISE & SKILLS</span>
          </div>
          <h2>Strengths</h2>
          <p className="card-subtext">Core competencies applied in project development</p>
          <div className="skill-row large">
            {member.skills.map((skill) => (
              <span key={skill} className="premium-skill-pill">
                {skill}
              </span>
            ))}
          </div>
        </article>

        {/* Working Area Matrix */}
        <article className="content-card wide-card">
          <div className="card-header-badge">
            <Target size={16} className="text-orange" />
            <span className="mini-label">EFFORT DISTRIBUTION</span>
          </div>
          <h2>Working Area Breakdown</h2>
          <p className="card-subtext">Relative sprint time and resource focus</p>
          <div className="progress-list-enhanced">
            {member.focus.map(([label, value]) => (
              <div key={label} className="progress-item-enhanced">
                <div className="progress-top">
                  <span className="progress-name">{label}</span>
                  <span className="progress-percent-badge">{value}%</span>
                </div>
                <div className="progress-track-enhanced">
                  <span
                    className="progress-fill-enhanced"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Teammate Switcher at bottom */}
      <TeammateSwitcher currentSlug={member.slug} members={members} />

      <MobileDock />
    </main>
  );
}
