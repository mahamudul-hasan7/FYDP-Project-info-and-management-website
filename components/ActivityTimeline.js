'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  Layers,
  ListTodo,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react';
import { projectLogs as initialLogs } from '../data/logs';

export default function ActivityTimeline() {
  const [logs, setLogs] = useState(initialLogs);
  const [publicStream, setPublicStream] = useState([]);
  const [stats, setStats] = useState({
    totalSprints: initialLogs.length,
    activeSprints: 1,
    completedSprints: initialLogs.length - 1,
    totalTasks: 5,
    doneTasks: 1,
    inProgressTasks: 2
  });
  const [activeView, setActiveView] = useState('sprints'); // 'sprints' | 'stream'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);

  // Fetch real-time activity data with throttling and visibility check
  const fetchTimelineData = async () => {
    if (typeof document !== 'undefined' && document.hidden) {
      return; // Skip polling when tab is inactive
    }

    try {
      const res = await fetch('/api/public/activity');
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.logs) && data.logs.length > 0) {
          setLogs(data.logs);
        }
        if (Array.isArray(data.publicStream)) {
          setPublicStream(data.publicStream);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        setIsLiveSyncing(true);
        setTimeout(() => setIsLiveSyncing(false), 800);
      }
    } catch (err) {
      // Fallback silently
    }
  };

  useEffect(() => {
    fetchTimelineData();

    // Controlled 30-second polling interval with visibility check
    const interval = setInterval(fetchTimelineData, 30000);
    const handleFocus = () => fetchTimelineData();

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Filter logs by category
  const filteredLogs = logs.filter((log) => {
    if (selectedCategory === 'ALL') return true;
    return (
      log.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Engineering' && log.category?.includes('Engineering')) ||
      (selectedCategory === 'Research' && log.category?.includes('Research')) ||
      (selectedCategory === 'Review' && log.category?.includes('Review'))
    );
  });

  const categories = ['ALL', 'Engineering', 'Research', 'Supervisor Review', 'Planning'];

  return (
    <section className="app-section" id="timeline">
      {/* Section Head with Live Real-time Status Badge */}
      <div className="app-section-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="mini-label">
              <Clock size={13} /> WEEKLY LOG & ROADMAP
            </span>
            <span className={`live-pulse-badge ${isLiveSyncing ? 'syncing' : ''}`}>
              <span className="live-dot" />
              <span>LIVE MILESTONE SYNC</span>
            </span>
          </div>
          <h2>Project Activity & Sprint Progression</h2>
        </div>
        <p>Continuous sprint updates, supervisor meeting directives, and verifiable engineering deliverables.</p>
      </div>

      {/* Progress & Milestone Overview Banner */}
      <div className="timeline-progress-banner">
        <div className="progress-banner-info">
          <div className="progress-banner-stat">
            <span className="progress-stat-label">Semester Progress</span>
            <strong className="progress-stat-value">
              Sprint 04 / 12 <small>• 33% Completed</small>
            </strong>
          </div>
          <div className="progress-banner-stat">
            <span className="progress-stat-label">Active Directives</span>
            <strong className="progress-stat-value">
              {stats.inProgressTasks} In Progress <small>({stats.doneTasks} Done)</small>
            </strong>
          </div>
          <div className="progress-banner-stat">
            <span className="progress-stat-label">Milestone Status</span>
            <span className="progress-status-badge on-track">
              <CheckCircle2 size={13} />
              Phase 1 On Track
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: '33.33%' }} />
        </div>
      </div>

      {/* View Switcher & Category Filter Controls */}
      <div className="timeline-control-bar">
        <div className="timeline-view-switcher">
          <button
            className={`timeline-view-btn ${activeView === 'sprints' ? 'active' : ''}`}
            onClick={() => setActiveView('sprints')}
          >
            <Layers size={15} />
            <span>Weekly Sprint Logs ({logs.length})</span>
          </button>
          <button
            className={`timeline-view-btn ${activeView === 'stream' ? 'active' : ''}`}
            onClick={() => setActiveView('stream')}
          >
            <Activity size={15} />
            <span>Real-time Action Feed</span>
            {publicStream.length > 0 && <span className="view-badge">{publicStream.length}</span>}
          </button>
        </div>

        {activeView === 'sprints' && (
          <div className="timeline-filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'ALL' ? 'All Milestones' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: Weekly Sprint Logs Grid */}
      {activeView === 'sprints' && (
        <div className="timeline-feed-grid">
          {filteredLogs.map((log) => {
            const isActive = log.status === 'active';

            return (
              <div key={log.id} className={`log-card ${isActive ? 'active-sprint' : ''}`}>
                <div className="log-card-header">
                  <div className="log-week-badge">
                    {isActive ? (
                      <CircleDot size={14} className="pulse-icon text-orange" />
                    ) : (
                      <CheckCircle2 size={14} className="text-emerald" />
                    )}
                    <span>{log.week}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="log-category-pill">{log.category}</span>
                  </div>
                </div>

                <div className="log-title-row">
                  <h3 className="log-title">{log.title}</h3>
                  {log.date && <span className="log-date-label">{log.date}</span>}
                </div>

                {log.author && (
                  <div className="log-author-tag">
                    <UserRound size={12} />
                    <span>Logged by <strong>{log.author}</strong></span>
                  </div>
                )}

                <ul className="log-highlights">
                  {log.highlights.map((point, idx) => (
                    <li key={idx}>
                      <span className="bullet-dot" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Real-time Live Action Feed Stream (With Strict Limitation) */}
      {activeView === 'stream' && (
        <div className="public-live-stream-box">
          <div className="stream-box-header">
            <Radio size={16} className="text-orange pulse-icon" />
            <strong>Verified Milestone Action Stream</strong>
            <span className="stream-header-time">Top 5 Recent</span>
          </div>

          <div className="stream-items-list">
            {publicStream.length === 0 ? (
              <div className="stream-empty-state">
                <span>No public milestone events yet.</span>
              </div>
            ) : (
              publicStream.map((item) => (
                <div key={item.id} className="stream-item-row">
                  <div className={`stream-item-icon ${item.badgeType}`}>
                    {item.badgeType === 'completed' ? (
                      <CheckCircle2 size={15} />
                    ) : item.badgeType === 'sprint' ? (
                      <Clock size={15} />
                    ) : (
                      <ListTodo size={15} />
                    )}
                  </div>

                  <div className="stream-item-content">
                    <div className="stream-item-meta">
                      <strong className="stream-actor-name">{item.actorName}</strong>
                      <span className="stream-role-tag">{item.actorRole}</span>
                      <span className={`stream-action-tag ${item.badgeType}`}>{item.actionTag}</span>
                      <span className="stream-time-text">{item.formattedTime}</span>
                    </div>
                    <p className="stream-item-details">{item.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="stream-footer-notice">
            <ShieldCheck size={14} className="text-emerald" />
            <span>Strict privacy filter active: Only verified sprint milestones & directive completions are broadcasted publicly.</span>
          </div>
        </div>
      )}
    </section>
  );
}
