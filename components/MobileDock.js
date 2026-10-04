'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Clock, FolderKanban, Home, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isDockHidden, setIsDockHidden] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/member/')) {
      setActiveTab('team');
      return;
    }

    // On homepage, track active section dynamically and hide dock near timeline end / footer
    const sections = ['home', 'team', 'project', 'timeline'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sections[i]);
          break;
        }
      }

      // Check if user has scrolled near timeline end or into the footer
      const footer = document.querySelector('.unified-app-footer, .app-footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        // When footer approaches or enters bottom view, hide dock
        const isNearFooter = rect.top <= (window.innerHeight - 30);
        setIsDockHidden(isNearFooter);
      } else {
        const nearBottom = window.innerHeight + window.scrollY >= (document.documentElement.scrollHeight - 140);
        setIsDockHidden(nearBottom);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(10);
      } catch (e) {}
    }
  };

  const handleNavClick = (sectionId, href) => {
    triggerHaptic();
    setActiveTab(sectionId);
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
  };

  // Only show dock on homepage to prevent overlapping on subpages
  if (pathname !== '/') return null;

  return (
    <nav className={`mobile-dock ${isDockHidden ? 'dock-hidden' : ''}`} aria-label="Mobile navigation">
      <button
        type="button"
        className={`dock-btn ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleNavClick('home', '/#home')}
        aria-label="Home"
      >
        <div className="dock-icon-wrapper">
          <Home size={18} />
        </div>
        <span>Home</span>
      </button>

      <button
        type="button"
        className={`dock-btn ${activeTab === 'team' ? 'active' : ''}`}
        onClick={() => handleNavClick('team', '/#team')}
        aria-label="Team"
      >
        <div className="dock-icon-wrapper">
          <UsersRound size={18} />
        </div>
        <span>Team</span>
      </button>

      <button
        type="button"
        className={`dock-btn ${activeTab === 'project' ? 'active' : ''}`}
        onClick={() => handleNavClick('project', '/#project')}
        aria-label="Project"
      >
        <div className="dock-icon-wrapper">
          <FolderKanban size={18} />
        </div>
        <span>Project</span>
      </button>

      <button
        type="button"
        className={`dock-btn ${activeTab === 'timeline' ? 'active' : ''}`}
        onClick={() => handleNavClick('timeline', '/#timeline')}
        aria-label="Timeline"
      >
        <div className="dock-icon-wrapper">
          <Clock size={18} />
        </div>
        <span>Timeline</span>
      </button>
    </nav>
  );
}
