'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, CircleDot, Clock, Code2, FolderKanban, GraduationCap, Layers, Mail, Sparkles } from 'lucide-react';
import { projectData as initialProjectData } from '../data/project';

export default function ProjectSection() {
  const [project, setProject] = useState(initialProjectData);

  useEffect(() => {
    fetch('/api/public/project')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.project) {
          setProject(data.project);
        }
      })
      .catch(() => {});
  }, []);

  const {
    title = initialProjectData.title,
    domain = initialProjectData.domain,
    status = initialProjectData.status,
    progressPercent = initialProjectData.progressPercent,
    supervisor = initialProjectData.supervisor,
    abstract = initialProjectData.abstract,
    techStack = initialProjectData.techStack,
    milestones = initialProjectData.milestones
  } = project || {};

  return (
    <section className="app-section" id="project">
      <div className="app-section-head">
        <div>
          <span className="mini-label">
            <Sparkles size={13} /> CURRENT FYDP
          </span>
          <h2>Project Workspace</h2>
        </div>
        <div className="project-head-meta">
          <span className="domain-pill">{domain}</span>
          <span className="status-pill live">
            <span className="status-dot" /> {status}
          </span>
        </div>
      </div>

      <div className="project-dashboard-card">
        {/* Main Title & Abstract */}
        <div className="project-main-info">
          <div className="project-icon-badge">
            <FolderKanban size={26} />
          </div>
          <div className="project-info-text">
            <h3>{title}</h3>
            <p>{abstract}</p>
          </div>
          <div className="project-progress-box">
            <div className="progress-label">
              <span>Overall Progress</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* 3-Column Compact Grid */}
        <div className="project-meta-grid">
          {/* Supervisor Card */}
          <div className="project-widget supervisor-widget">
            <div className="widget-header">
              <GraduationCap size={18} />
              <span>Project Supervisor</span>
            </div>
            <div className="widget-body">
              <h4>{supervisor?.name || 'Faculty Supervisor'}</h4>
              <p className="supervisor-desig">{supervisor?.designation || 'Supervisor'}</p>
              <p className="supervisor-dept">{supervisor?.department || 'Department of CSE, UIU'}</p>
              {supervisor?.email && (
                <a className="supervisor-email" href={`mailto:${supervisor.email}`}>
                  <Mail size={13} />
                  <span>{supervisor.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div className="project-widget stack-widget">
            <div className="widget-header">
              <Code2 size={18} />
              <span>Core Tech Stack</span>
            </div>
            <div className="stack-tag-grid">
              {(techStack || []).map((tech) => (
                <span key={tech.name || tech} className="stack-tag">
                  <strong>{tech.name || tech}</strong>
                  {tech.category && <small>{tech.category}</small>}
                </span>
              ))}
            </div>
          </div>

          {/* Milestones Road Map */}
          <div className="project-widget milestone-widget">
            <div className="widget-header">
              <Layers size={18} />
              <span>Milestone Roadmap</span>
            </div>
            <div className="mini-milestone-list">
              {(milestones || []).map((m, idx) => {
                const isCompleted = m.status === 'completed';
                const isActive = m.status === 'active';

                return (
                  <div
                    key={m.title || idx}
                    className={`mini-milestone-item ${isCompleted ? 'done' : ''} ${isActive ? 'current' : ''}`}
                  >
                    <span className="milestone-icon-wrap">
                      {isCompleted ? (
                        <CheckCircle2 size={14} className="text-emerald" />
                      ) : isActive ? (
                        <CircleDot size={14} className="text-orange pulse" />
                      ) : (
                        <Clock size={14} className="text-muted" />
                      )}
                    </span>
                    <div className="milestone-text">
                      <strong>{m.title}</strong>
                      <span>{m.date || `Milestone 0${idx + 1}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
