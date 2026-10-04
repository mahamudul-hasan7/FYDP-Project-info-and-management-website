'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  Users
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import TeamLogo from '../../components/TeamLogo';

const REGISTERED_MEMBERS = [
  { name: 'Admin', id: 'admin', label: '👑 Admin', isAdmin: true },
  { name: 'Mahamudul', id: '0112330182', label: 'Mahamudul', isAdmin: false },
  { name: 'Sabbir', id: '0112331026', label: 'Sabbir', isAdmin: false },
  { name: 'Tania', id: '0112331025', label: 'Tania', isAdmin: false },
  { name: 'Maria', id: '0112331019', label: 'Maria', isAdmin: false },
  { name: 'Rehnuma', id: '0112310260', label: 'Rehnuma', isAdmin: false }
];

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('0112330182');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingSession, setExistingSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if session already active on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setExistingSession(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!identifier) {
      setError('Please select a member profile above.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, rememberMe })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Incorrect password.');
        setLoading(false);
        return;
      }

      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/portal');
      }, 750);
    } catch (err) {
      setError('Connection failed. Please check network and try again.');
      setLoading(false);
    }
  };

  const handleSwitchUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setExistingSession(null);
      setIdentifier('0112330182');
      setPassword('');
    } catch (e) {
      setExistingSession(null);
    }
  };

  const handleSelectMemberId = (id) => {
    setIdentifier(id);
    setError('');
  };

  return (
    <main className="app-shell login-screen">
      {/* Topbar */}
      <header className="topbar profile-topbar">
        <Link className="profile-back-btn" href="/" aria-label="Back to Homepage">
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <div className="login-top-brand">
          <TeamLogo size={22} />
          <span>Team Random</span>
        </div>
        <ThemeToggle />
      </header>

      <section className="login-card-container">
        <div className="login-hero-glow" aria-hidden="true" />

        <div className={`login-box modern-glass-card ${isSuccess ? 'login-card-success' : ''}`}>
          {/* Subtle Top Loading Line on Success */}
          {isSuccess && <div className="login-card-progress-bar" />}

          {/* Header */}
          <div className="login-box-head">
            <div className="login-brand-badge">
              <TeamLogo size={42} />
            </div>

            <div className="login-security-tag">
              <ShieldCheck size={12} className="text-emerald" />
              <span>SERVER AUTHENTICATED • PRIVATE WORKSPACE</span>
            </div>

            <h1>Workspace Portal</h1>
            <p>Select your profile and enter your confidential password to log in.</p>
          </div>

          {/* If already logged in, provide prompt to continue or switch */}
          {existingSession && !checkingSession ? (
            <div className="active-session-prompt">
              <div className="session-active-card">
                <div className="session-user-row">
                  <div className="session-avatar-dot">
                    {existingSession.role === 'ADMIN' ? (
                      <Crown size={20} className="text-orange" />
                    ) : (
                      <UserCheck size={20} className="text-emerald" />
                    )}
                  </div>
                  <div className="session-user-info">
                    <div className="session-badge-line">
                      <strong>{existingSession.name}</strong>
                      {existingSession.role === 'ADMIN' && (
                        <span className="session-role-pill admin">Super Admin 👑</span>
                      )}
                    </div>
                    <span>{existingSession.username} • {existingSession.roleTitle}</span>
                  </div>
                </div>

                <div className="session-actions-grid">
                  <button
                    type="button"
                    className="primary-action login-action-btn"
                    onClick={() => router.push('/portal')}
                  >
                    <span>Open Workspace Portal</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="soft-action switch-account-btn"
                    onClick={handleSwitchUser}
                  >
                    <LogOut size={15} />
                    <span>Sign Out / Switch Member</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Quick ID helper pills for effortless profile selection */}
              <div className="quick-id-selector-bar">
                <div className="quick-id-head">
                  <Users size={12} className="text-orange" />
                  <span>SELECT YOUR PROFILE:</span>
                </div>
                <div className="quick-id-pills-row">
                  {REGISTERED_MEMBERS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`quick-id-pill ${identifier === m.id ? 'active' : ''}`}
                      onClick={() => handleSelectMemberId(m.id)}
                      title={`${m.name} (${m.id})`}
                    >
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback alerts */}
              {error && (
                <div className="login-alert error">
                  <ShieldAlert size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Secure Form with only Password */}
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrap">
                    <KeyRound size={17} className="input-icon" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter confidential password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      autoComplete="current-password"
                      disabled={isSuccess}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="login-options-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isSuccess}
                    />
                    <span>Remember this device (7 days)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`primary-action login-submit-btn ${isSuccess ? 'btn-success-state' : ''}`}
                  disabled={loading || isSuccess}
                >
                  {loading ? (
                    <span className="btn-inline-flex">
                      <span className="btn-spinner" />
                      <span>Signing in...</span>
                    </span>
                  ) : isSuccess ? (
                    <span className="btn-inline-flex">
                      <Check size={17} className="check-pop-anim" />
                      <span>Authenticated • Redirecting...</span>
                    </span>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Log in to Workspace</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="login-notice-box">
            <span>🔒 Protected FYDP Workspace • UIU Dept. of CSE</span>
          </div>
        </div>
      </section>
    </main>
  );
}



