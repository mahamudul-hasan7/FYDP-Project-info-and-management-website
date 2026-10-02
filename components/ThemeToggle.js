'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('team-random-theme');
    const isDark = saved ? saved === 'dark' : true;
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    setDark(isDark);

    const handleThemeChange = (e) => {
      setDark(e.detail.theme === 'dark');
    };
    window.addEventListener('team-theme-change', handleThemeChange);
    return () => window.removeEventListener('team-theme-change', handleThemeChange);
  }, []);

  const toggle = () => {
    const next = !dark;
    const nextTheme = next ? 'dark' : 'light';
    setDark(next);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('team-random-theme', nextTheme);
    window.dispatchEvent(new CustomEvent('team-theme-change', { detail: { theme: nextTheme } }));
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
