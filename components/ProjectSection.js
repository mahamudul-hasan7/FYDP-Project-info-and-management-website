'use client';

import { CheckCircle2, CircleDot, Clock, Code2, FolderKanban, GraduationCap, Layers, Mail, Sparkles } from 'lucide-react';
import { projectData } from '../data/project';

export default function ProjectSection() {
  const { title, domain, status, progressPercent, supervisor, abstract, techStack, milestones } = projectData;

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
              <h4>{supervisor.name}</h4>
              <p className="supervisor-desig">{supervisor.designation}</p>
              <p className="supervisor-dept">{supervisor.department}</p>
              {supervisor.email && (
                <a className="supervisor-email" href={`mailto:${supervisor.email}`}>
                  <Mail size={13} />
                  <span>{supervisor.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Card */}
          <div className="project-widget stack-widget">
            <div className="widget-header">
              <Code2 size={18} />
              <span>Technologies & Tools</span>
            </div>
            <div className="widget-body">
              <div className="tech-badge-wrap">
                {techStack.map((tech) => (
                  <span key={tech.name} className="tech-badge" title={tech.category}>
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones Stepper Card */}
          <div className="project-widget timeline-widget">
            <div className="widget-header">
              <Layers size={18} />
              <span>Milestones & Timeline</span>
            </div>
            <div className="widget-body">
              <div className="milestones-stepper">
                {milestones.map((item, idx) => {
                  const isDone = item.status === 'completed';
                  const isActive = item.status === 'active';

                  return (
                    <div key={item.title} className={`milestone-step ${item.status}`}>
                      <div className="step-icon">
                        {isDone ? (
                          <CheckCircle2 size={15} />
                        ) : isActive ? (
                          <CircleDot size={15} className="pulse-icon" />
                        ) : (
                          <Clock size={15} />
                        )}
                      </div>
                      <div className="step-content">
                        <strong>{item.title}</strong>
                        <small>{item.date}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
