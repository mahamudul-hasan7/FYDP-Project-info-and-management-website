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
  Facebook,
  Flame,
  FolderGit2,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Layers,
  Layout,
  Linkedin,
  Mail,
  MessageCircle,
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

  const socialLinks = [
    {
      name: 'Portfolio',
      handle: 'mahamud.xyz',
      url: 'https://www.mahamud.xyz/',
      icon: Globe,
      color: '#f36d22',
      badge: 'Official Site',
      primary: true
    },
    {
      name: 'GitHub',
      handle: '@mahamudul-hasan7',
      url: 'https://github.com/mahamudul-hasan7',
      icon: Github,
      color: '#e6edf3',
      badge: 'Code Repositories'
    },
    {
      name: 'LinkedIn',
      handle: 'in/mahamudulxhasan',
      url: 'https://www.linkedin.com/in/mahamudulxhasan/',
      icon: Linkedin,
      color: '#0a66c2',
      badge: 'Professional Network'
    },
    {
      name: 'WhatsApp',
      handle: '+880 1810-394869',
      url: 'https://wa.me/8801810394869?text=Hi%20Mahamudul%2C%20reaching%20out%20from%20your%20FYDP%20Workspace',
      icon: MessageCircle,
      color: '#25d366',
      badge: 'Direct Message',
      highlight: true
    },
    {
      name: 'Facebook',
      handle: 'fb.com/rakibmahamudh',
      url: 'https://www.facebook.com/rakibmahamudh',
      icon: Facebook,
      color: '#1877f2',
      badge: 'Social Connect'
    },
    {
      name: 'Instagram',
      handle: '@rakib_mahamudul',
      url: 'https://www.instagram.com/rakib_mahamudul/',
      icon: Instagram,
      color: '#e1306c',
      badge: 'Visual Journal'
    }
  ];

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

            {/* Quick Hero Social / Contact Actions */}
            <div className="dev-actions-grid">
              <a
                href="https://www.mahamud.xyz/"
                target="_blank"
                rel="noreferrer"
                className="dev-btn dev-btn-primary"
                title="Visit Mahamudul's Official Portfolio"
              >
                <Globe size={16} />
                <span>mahamud.xyz</span>
                <ExternalLink size={13} className="dev-external-arrow" />
              </a>

              <a
                href="https://github.com/mahamudul-hasan7"
                target="_blank"
                rel="noreferrer"
                className="dev-btn dev-btn-outline"
                title="View GitHub Repositories"
              >
                <Github size={16} />
                <span>GitHub</span>
                <ExternalLink size={13} className="dev-external-arrow" />
              </a>

              <a
                href="https://www.linkedin.com/in/mahamudulxhasan/"
                target="_blank"
                rel="noreferrer"
                className="dev-btn dev-btn-outline"
                title="Connect on LinkedIn"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                <ExternalLink size={13} className="dev-external-arrow" />
              </a>

              <a
                href="https://wa.me/8801810394869?text=Hi%20Mahamudul%2C%20reaching%20out%20from%20your%20FYDP%20Workspace"
                target="_blank"
                rel="noreferrer"
                className="dev-btn dev-btn-whatsapp"
                title="Direct WhatsApp Message"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
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
        {/* Left Column: Engineering Philosophy & Blueprint */}
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

        {/* Right Column: Social Channels Hub, Tech Arsenal & Terminal */}
        <div className="dev-right-col">
          {/* Verified Social & Contact Hub Card */}
          <article className="content-card dev-card dev-social-hub-card">
            <div className="card-header-badge">
              <Globe size={16} className="text-orange" />
              <span className="mini-label">OFFICIAL CHANNELS</span>
            </div>
            <h2>Verified Connect Hub</h2>
            <p className="card-subtext">Connect with Mahamudul across official engineering and social platforms</p>

            <div className="dev-channels-list">
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`dev-channel-row ${social.primary ? 'channel-primary' : ''} ${social.highlight ? 'channel-whatsapp' : ''}`}
                  >
                    <div className="dev-channel-icon-wrap" style={{ color: social.color }}>
                      <IconComponent size={18} />
                    </div>
                    <div className="dev-channel-info">
                      <div className="dev-channel-title-group">
                        <strong className="dev-channel-name">{social.name}</strong>
                        <span className="dev-channel-badge">{social.badge}</span>
                      </div>
                      <span className="dev-channel-handle">{social.handle}</span>
                    </div>
                    <ExternalLink size={15} className="dev-channel-arrow" />
                  </a>
                );
              })}
            </div>
          </article>

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
                <p><span className="term-key">role:</span> &quot;Lead Technical Architect / Systems Engineer&quot;</p>
                <p><span className="term-key">portfolio:</span> <span className="term-green">&quot;https://www.mahamud.xyz&quot;</span></p>
                <p><span className="term-key">whatsapp:</span> &quot;+8801810394869&quot;</p>
                <p><span className="term-key">status:</span> <span className="term-green">&quot;Engineering High-Impact Solutions&quot;</span></p>
              </div>

              <div className="dev-term-line" style={{ marginTop: '14px' }}>
                <span className="term-prompt">$</span> <span className="term-cmd">cat social_links.json</span>
              </div>
              <div className="term-output">
                <p><span className="term-key">github:</span> &quot;https://github.com/mahamudul-hasan7&quot;</p>
                <p><span className="term-key">linkedin:</span> &quot;https://linkedin.com/in/mahamudulxhasan&quot;</p>
                <p><span className="term-key">facebook:</span> &quot;https://facebook.com/rakibmahamudh&quot;</p>
                <p><span className="term-key">instagram:</span> &quot;https://instagram.com/rakib_mahamudul&quot;</p>
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
