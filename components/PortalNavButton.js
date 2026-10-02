'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Lock, LogIn, UserRound } from 'lucide-react';

export default function PortalNavButton() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setSession(data.user);
        }
      })
      .catch(() => {});
  }, []);

  if (session) {
    const isAdmin = session.role === 'ADMIN';
    return (
      <Link
        href="/portal"
        className={`portal-nav-btn ${isAdmin ? 'admin-logged' : 'member-logged'}`}
        title="Open Team Workspace Portal"
      >
        {isAdmin ? <Crown size={14} className="text-orange" /> : <UserRound size={14} />}
        <span className="portal-btn-label">
          {session.name.split(' ')[0]} {isAdmin ? '👑' : ''}
        </span>
      </Link>
    );
  }

  return (
    <Link href="/login" className="portal-nav-btn" title="Member & Admin Login">
      <Lock size={13} />
      <span className="portal-btn-label">Portal</span>
    </Link>
  );
}
