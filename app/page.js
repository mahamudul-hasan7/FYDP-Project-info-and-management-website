import Link from 'next/link';
import { CheckCircle2, CircleDot, FolderKanban, UsersRound } from 'lucide-react';
import TeamGrid from '../components/TeamGrid';
import ThemeToggle from '../components/ThemeToggle';
import MobileDock from '../components/MobileDock';
import TeamBanner from '../components/TeamBanner';
import TeamLogo from '../components/TeamLogo';
import ProjectSection from '../components/ProjectSection';
import ActivityTimeline from '../components/ActivityTimeline';
import PortalNavButton from '../components/PortalNavButton';
import { getAllMembers } from '../lib/store';
import { projectData } from '../data/project';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const members = getAllMembers() || [];
  const totalMembers = members.length;
  const readyProfiles = members.filter((m) => !m.placeholder).length;

  return (
    <main className="app-shell" id="home">
      <header className="topbar">
        <Link className="app-brand" href="/">
          <TeamLogo size={42} />
          <span><strong>Team Random</strong><small>FYDP Workspace</small></span>
        </Link>
        <div className="topbar-actions">
          <span className="desktop-status"><CircleDot size={14} /> {readyProfiles} profiles ready</span>
          <PortalNavButton />
          <ThemeToggle />
        </div>
      </header>

      <TeamBanner members={members} />

      <section className="quick-grid" aria-label="Team summary">
        <div className="quick-card"><UsersRound size={20}/><span>Members</span><strong>{totalMembers}</strong></div>
        <div className="quick-card"><CheckCircle2 size={20}/><span>Profiles ready</span><strong>{readyProfiles}</strong></div>
        <div className="quick-card"><FolderKanban size={20}/><span>Project</span><strong>{projectData.status.split('•')[0].trim()}</strong></div>
      </section>

      <section className="app-section" id="team">
        <div className="app-section-head">
          <div><span className="mini-label">TEAM DIRECTORY</span><h2>People & roles</h2></div>
          <p>Tap a member to open a quick profile. Use “View full profile” for complete information.</p>
        </div>
        <TeamGrid members={members} />
      </section>

      <ProjectSection />

      <ActivityTimeline />

      <footer className="app-footer">
        <span>Team Random • Final Year Design Project</span>
        <span>Designed for mobile-first use & Vercel</span>
      </footer>

      <MobileDock />
    </main>
  );
}
