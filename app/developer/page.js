'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Briefcase,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  FolderGit2,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Layout,
  Linkedin,
  Mail,
  Phone,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function DeveloperPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const emailAddress = 'mhasan2330182@bscse.uiu.ac.bd';

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const techStack = [
    { name: 'Next.js 15 (App Router)', category: 'frontend', level: 'Advanced', icon: Layout },
    { name: 'React 19 & Hooks', category: 'frontend', level: 'Advanced', icon: Code2 },
    { name: 'Modern CSS & Design Tokens', category: 'frontend', level: 'Advanced', icon: Sparkles },
    { name: 'Framer Motion', category: 'frontend', level: 'Intermediate', icon: Flame },
    { name: 'Node.js & Next APIs', category: 'backend', level: 'Advanced', icon: Server },
    { name: 'Supabase & PostgreSQL', category: 'database', level: 'Advanced', icon: Database },
    { name: 'Database Architecture & RLS', category: 'database', level: 'Advanced', icon: ShieldCheck },
    { name: 'REST APIs & WebSockets', category: 'backend', level: 'Advanced', icon: Layers },
    { name: 'Git & Vercel CI/CD', category: 'devops', level: 'Advanced', icon: Rocket },
    { name: 'System Architecture Design', category: 'devops', level: 'Advanced', icon: Cpu }
  ];

  const filteredTech = activeTab === 'all' ? techStack : techStack.filter(t => t.category === activeTab);

  const architectureHighlights = [
    {
      title: 'Full Cloud Database Persistence',
      desc: 'Engineered a resilient Supabase PostgreSQL database layer with multi-table relational schema for members, tasks, logs, and workspace configuration.',
      tag: 'Backend & DB'
    },
    {
      title: 'Role-Based Authentication Engine',
      desc: 'Built a multi-tier session state with student credentials, secure hashing verification, and role-based portal authorization.',
      tag: 'Security'
    },
    {
      title: 'Zero-Layout-Shift Responsive Engine',
      desc: 'Architected dynamic 2+3 desktop grid hierarchy, mobile dock navigation, and iOS-grade responsive cards with fluid typography tokens.',
      tag: 'UI/UX Architecture'
    },
    {
      title: 'Real-Time Sync & Live State',
      desc: 'Implemented smart polling and window focus refresh protocols ensuring live synchronization across concurrent active team sessions.',
      tag: 'Real-time State'
    }
  ];

  return (
    <main className="app-shell dev-portfolio-shell">
      {/* Top Navbar */}
      <header className="topbar dev-topbar">
        <Link className="profile-back-btn dev-back-pill" href="/" aria-label="Back to Team Home">
          <ArrowLeft size={17} />
          <span className="back-text">Back to Home</span>
        </Link>

        <div className="dev-signature-mark">
          <Code2 size={16} className="dev-sig-icon text-orange" />
          <span className="dev-sig-title">Mahamudul<span className="text-orange">.dev</span></span>
          <span className="dev-sig-badge">SYS_ARCHITECT</span>
        </div>

        <div className="profile-top-actions">
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Showcase Card */}
      <section className="dev-hero-card">
        <div className="dev-hero-glow" aria-hidden="true" />
        <div className="dev-hero-mesh" aria-hidden="true" />

        <div className="dev-hero-content">
          <div className="dev-avatar-column">
            <div className="dev-avatar-halo">
              <div className="dev-avatar-frame">
                <Image
                  src="/members/md-mahamudul-hasan.jpg"
                  alt="Md Mahamudul Hasan"
                  width={140}
                  height={140}
                  priority
                  className="dev-avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="dev-avatar-fallback">MH</div>
              </div>
              <span className="dev-online-pill">
                <span className="dev-pulse-dot" />
                <span>Lead Architect</span>
              </span>
            </div>
          </div>

          <div className="dev-hero-text">
            <div className="dev-kicker-row">
              <span className="dev-kicker-pill">
                <GraduationCap size={13} />
                <span>United International University</span>
              </span>
              <span className="dev-id-tag">ID: 011 233 0182</span>
            </div>

            <h1 className="dev-title">Md Mahamudul Hasan</h1>
            <p className="dev-role-label">
              Lead Software Architect &amp; Full-Stack Systems Engineer
            </p>
            <p className="dev-tagline">
              Architecting high-performance web systems, robust cloud databases, and scalable digital workspaces with clean engineering standards.
            </p>

            {/* Social & Contact Actions */}
            <div className="dev-actions-grid">
              <a
                href="https://github.com/mahamudul-hasan7"
                target="_blank"
                rel="noreferrer"
                className="dev-btn dev-btn-primary"
              >
                <Github size={16} />
                <span>GitHub Profile</span>
                <ExternalLink size={13} className="dev-external-arrow" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="dev-btn dev-btn-outline"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                <ExternalLink size={13} className="dev-external-arrow" />
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="dev-btn dev-btn-copy"
                title="Click to copy official email address"
              >
                {copiedEmail ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="dev-metrics-bar">
          <div className="dev-metric-item">
            <span className="dev-metric-num">FYDP 2026</span>
            <span className="dev-metric-lbl">Lead Architect &amp; Dev</span>
          </div>
          <div className="dev-metric-divider" />
          <div className="dev-metric-item">
            <span className="dev-metric-num">Full-Stack</span>
            <span className="dev-metric-lbl">Next.js 15 &amp; Supabase</span>
          </div>
          <div className="dev-metric-divider" />
          <div className="dev-metric-item">
            <span className="dev-metric-num">Dept of CSE</span>
            <span className="dev-metric-lbl">United International Univ.</span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="dev-main-grid">
        {/* Left Column: Engineering Philosophy & Bio */}
        <div className="dev-left-col">
          <article className="content-card dev-card">
            <div className="card-header-badge">
              <Sparkles size={16} className="text-orange" />
              <span className="mini-label">DEVELOPER VISION</span>
            </div>
            <h2>Engineering Philosophy</h2>
            <div className="dev-bio-prose">
              <p>
                As the <strong>Lead Technical Architect</strong> of Team Random, I designed and developed the complete software ecosystem for our Final Year Design Project (FYDP). My goal was to create a modern, resilient workspace that eliminates communication silos and bridges team execution with supervisor transparency.
              </p>
              <p>
                I prioritize <strong>clean code architecture</strong>, strict data integrity, zero latency UI interactions, and production-grade software craftsmanship over temporary shortcuts.
              </p>
            </div>

            <div className="dev-pillars-grid">
              <div className="dev-pillar-box">
                <div className="dev-pillar-icon-wrap">
                  <Flame size={18} className="text-orange" />
                </div>
                <div>
                  <h4>Zero-Latency UX</h4>
                  <p>Instant optimistic updates, fluid responsiveness, and fast server-side hydration.</p>
                </div>
              </div>

              <div className="dev-pillar-box">
                <div className="dev-pillar-icon-wrap">
                  <ShieldCheck size={18} className="text-orange" />
                </div>
                <div>
                  <h4>Resilient Data Modeling</h4>
                  <p>Relational Postgres structures, ACID transactions, and bidirectional fallback syncing.</p>
                </div>
              </div>

              <div className="dev-pillar-box">
                <div className="dev-pillar-icon-wrap">
                  <Cpu size={18} className="text-orange" />
                </div>
                <div>
                  <h4>Scalable System Design</h4>
                  <p>Modular component hierarchies and decoupled API routes designed for future extensions.</p>
                </div>
              </div>
            </div>
          </article>

          {/* FYDP System Architecture Breakdown */}
          <article className="content-card dev-card">
            <div className="card-header-badge">
              <Layers size={16} className="text-orange" />
              <span className="mini-label">SYSTEM BLUEPRINT</span>
            </div>
            <h2>How This Platform Was Built</h2>
            <p className="card-subtext">Technical architecture and engineering decisions behind Team Random Workspace</p>

            <div className="dev-arch-list">
              {architectureHighlights.map((arch, idx) => (
                <div key={idx} className="dev-arch-item">
                  <div className="dev-arch-header">
                    <span className="dev-arch-idx">0{idx + 1}</span>
                    <span className="dev-arch-tag">{arch.tag}</span>
                  </div>
                  <h3>{arch.title}</h3>
                  <p>{arch.desc}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Right Column: Tech Arsenal & Terminal */}
        <div className="dev-right-col">
          {/* Tech Arsenal Card */}
          <article className="content-card dev-card">
            <div className="card-header-badge">
              <Code2 size={16} className="text-orange" />
              <span className="mini-label">CORE COMPETENCIES</span>
            </div>
            <h2>Tech Arsenal</h2>
            <p className="card-subtext">Core technologies, frameworks, and engineering tools</p>

            {/* Filter Tabs */}
            <div className="dev-tech-tabs">
              <button
                type="button"
                className={`dev-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`dev-tab-btn ${activeTab === 'frontend' ? 'active' : ''}`}
                onClick={() => setActiveTab('frontend')}
              >
                Frontend
              </button>
              <button
                type="button"
                className={`dev-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveTab('backend')}
              >
                Backend
              </button>
              <button
                type="button"
                className={`dev-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
                onClick={() => setActiveTab('database')}
              >
                Database
              </button>
              <button
                type="button"
                className={`dev-tab-btn ${activeTab === 'devops' ? 'active' : ''}`}
                onClick={() => setActiveTab('devops')}
              >
                DevOps
              </button>
            </div>

            <div className="dev-tech-grid">
              {filteredTech.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="dev-tech-pill">
                    <div className="dev-tech-pill-icon">
                      <IconComponent size={16} />
                    </div>
                    <div className="dev-tech-pill-body">
                      <span className="dev-tech-pill-name">{item.name}</span>
                      <span className="dev-tech-pill-cat">{item.level}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Interactive Developer Terminal Widget */}
          <article className="content-card dev-card dev-terminal-card">
            <div className="dev-terminal-header">
              <div className="dev-terminal-dots">
                <span className="dev-dot dev-dot-red" />
                <span className="dev-dot dev-dot-yellow" />
                <span className="dev-dot dev-dot-green" />
              </div>
              <span className="dev-terminal-title">mahamudul@workspace:~</span>
              <Terminal size={14} className="text-muted" />
            </div>

            <div className="dev-terminal-body">
              <div className="dev-term-line">
                <span className="term-prompt">$</span> <span className="term-cmd">whoami --verbose</span>
              </div>
              <div className="term-output">
                <p><span className="term-key">name:</span> &quot;Md Mahamudul Hasan&quot;</p>
                <p><span className="term-key">role:</span> &quot;Technical Lead / Full-Stack Engineer&quot;</p>
                <p><span className="term-key">institution:</span> &quot;United International University (UIU)&quot;</p>
                <p><span className="term-key">student_id:</span> &quot;011 233 0182&quot;</p>
                <p><span className="term-key">status:</span> <span className="term-green">&quot;Ready for High-Impact Challenges&quot;</span></p>
              </div>

              <div className="dev-term-line" style={{ marginTop: '14px' }}>
                <span className="term-prompt">$</span> <span className="term-cmd">cat contact_info.json</span>
              </div>
              <div className="term-output">
                <p><span className="term-key">email:</span> &quot;mhasan2330182@bscse.uiu.ac.bd&quot;</p>
                <p><span className="term-key">github:</span> &quot;https://github.com/mahamudul-hasan7&quot;</p>
                <p><span className="term-key">workspace:</span> &quot;Team Random FYDP Platform&quot;</p>
              </div>
            </div>
          </article>

          {/* Contact Direct Card */}
          <article className="content-card dev-card dev-contact-card">
            <div className="card-header-badge">
              <Mail size={16} className="text-orange" />
              <span className="mini-label">DIRECT INQUIRY</span>
            </div>
            <h2>Get In Touch</h2>
            <p className="card-subtext">Connect for collaboration, software discussions, or technical queries.</p>

            <div className="dev-contact-rows">
              <div className="dev-contact-row">
                <div className="dev-contact-icon"><Mail size={16} /></div>
                <div className="dev-contact-detail">
                  <small>Academic Email</small>
                  <strong>mhasan2330182@bscse.uiu.ac.bd</strong>
                </div>
              </div>

              <div className="dev-contact-row">
                <div className="dev-contact-icon"><GraduationCap size={16} /></div>
                <div className="dev-contact-detail">
                  <small>Department</small>
                  <strong>Computer Science &amp; Engineering</strong>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Developer Page Footer */}
      <footer className="dev-footer-banner">
        <div className="dev-footer-inner">
          <div className="dev-footer-left">
            <Code2 size={18} className="text-orange" />
            <p>
              Designed &amp; Engineered by <strong>Md Mahamudul Hasan</strong> for UIU CSE FYDP 2026.
            </p>
          </div>
          <div className="dev-footer-right">
            <Link href="/" className="dev-footer-link">Home Directory</Link>
            <span className="dev-footer-bullet">•</span>
            <Link href="/portal" className="dev-footer-link">Team Portal</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
