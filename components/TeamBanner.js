'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  GraduationCap,
  Video
} from 'lucide-react';

export default function TeamBanner({ members }) {
  const [mediaMode, setMediaMode] = useState('video'); // 'video' | 'image'
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [config, setConfig] = useState({
    videoUrl: '/team-banner.mp4',
    imageUrl: '/team-banner.jpg',
    headline: 'Team Random',
    tagline: 'Engineering scalable software architecture & intelligent computing solutions.'
  });

  const videoRef = useRef(null);

  // Load dynamic banner config if available
  useEffect(() => {
    fetch('/api/portal/banner')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(data.config);
          if (data.config.mode === 'image') {
            setMediaMode('image');
          } else if (data.config.mode === 'video') {
            setMediaMode('video');
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
    setMediaMode('image');
  };

  return (
    <div className="hud-banner-outer-wrap">
      {/* 3D Dynamic Ambient Glow Aura (Orange & Cyan Radial Light) */}
      <div className="hud-ambient-glow-aura" aria-hidden="true">
        <div className="glow-sphere orange-glow" />
        <div className="glow-sphere cyan-glow" />
      </div>

      <section className="hud-team-banner">
        {/* Neon Glassmorphism Border Highlight */}
        <div className="hud-border-glow-shine" aria-hidden="true" />

        {/* 16:9 Full Team Video Background - Strictly Silent & Ambient */}
        {mediaMode === 'video' && !videoError && (
          <video
            ref={videoRef}
            className="hud-banner-video"
            src={config.videoUrl || '/team-banner.mp4'}
            poster={config.imageUrl || '/team-banner.jpg'}
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
          />
        )}

        {/* 16:9 Image Background (Photo Mode or Video Fallback) */}
        {(mediaMode === 'image' || videoError) && !imageError && (
          <img
            src={config.imageUrl || '/team-banner.jpg'}
            alt="Team Random Full Members Group"
            className="hud-banner-img"
            onError={() => setImageError(true)}
          />
        )}

        {/* Fallback if neither video nor image is present */}
        {(mediaMode === 'image' || videoError) && imageError && (
          <div className="hud-fallback-bg">
            <div className="banner-upload-hint">
              <Video size={18} />
              <span>
                Add group video as <strong>public/team-banner.mp4</strong> or photo as <strong>public/team-banner.jpg</strong>
              </span>
            </div>
          </div>
        )}

        {/* Soft Vignette Overlay for Crisp Readability */}
        <div className="hud-overlay" />

        {/* HUD Distributed UI Elements */}
        <div className="hud-content">
          {/* Top Header Row with Academic & Member Pills */}
          <div className="hud-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="hud-pill">
                <GraduationCap size={13} /> UIU Dept. of CSE
              </span>
              <span className="hud-pill hud-status">
                <span className="pulse-dot" /> FYDP 2026 • {members.length} Members
              </span>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="hud-bottom-row">
            <div className="hud-title-box">
              <h2 className="hud-title">{config.headline || 'Team Random'}</h2>
              <p className="hud-desc">
                {config.tagline || 'Engineering scalable software architecture & intelligent computing solutions.'}
              </p>
            </div>

            <div className="hud-btn-group">
              <a className="hud-btn primary" href="#team">
                <span>View Team</span>
                <ArrowUpRight size={15} />
              </a>
              <a className="hud-btn glass" href="#project">
                <span>Project Scope</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
