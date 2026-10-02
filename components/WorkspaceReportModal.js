'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Printer,
  Shield,
  UserCheck,
  X
} from 'lucide-react';
import { useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { projectData } from '../data/project';

export default function WorkspaceReportModal({
  isOpen,
  onClose,
  members = [],
  logs = [],
  tasks = []
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const reportDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop report-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
      >
        <motion.div
          className="report-modal-sheet"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Modal Header Controls (Hidden during print) */}
          <div className="report-controls-bar no-print">
            <div className="report-controls-title">
              <FileText size={18} className="text-orange" />
              <span>Official Academic Sprint & Workspace Report</span>
            </div>
            <div className="report-controls-actions">
              <button onClick={handlePrint} className="primary-action compact-btn">
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
              <button onClick={onClose} className="modal-close-static" aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Report Document Body */}
          <div className="printable-report-document" id="printable-report">
            {/* Academic Letterhead Header */}
            <div className="report-univ-header">
              <div className="report-logo-col">
                <TeamLogo size={52} />
              </div>
              <div className="report-univ-meta">
                <h2>UNITED INTERNATIONAL UNIVERSITY</h2>
                <h3>Department of Computer Science & Engineering</h3>
                <p>Final Year Design Project (FYDP) • Academic Progress & Workspace Audit Report</p>
              </div>
              <div className="report-doc-badge">
                <span className="report-status-tag">CONFIDENTIAL • FYDP</span>
                <span className="report-gen-date">Generated: {reportDate}</span>
              </div>
            </div>

            <hr className="report-divider-bold" />

            {/* Section 1: Project Metadata */}
            <div className="report-section">
              <h4 className="report-section-title">1. Project & Faculty Consultation Summary</h4>
              <div className="report-info-grid">
                <div>
                  <span className="report-label">PROJECT TITLE:</span>
                  <strong>{projectData.title}</strong>
                </div>
                <div>
                  <span className="report-label">TEAM IDENTITY:</span>
                  <strong>Team Random (FYDP Phase 1)</strong>
                </div>
                <div>
                  <span className="report-label">DOMAIN / FOCUS:</span>
                  <strong>{projectData.domain}</strong>
                </div>
                <div>
                  <span className="report-label">PROJECT SUPERVISOR:</span>
                  <strong>{projectData.supervisor.name} ({projectData.supervisor.designation}, {projectData.supervisor.department})</strong>
                </div>
              </div>
            </div>

            {/* Section 2: Team Roster & Module Allocations */}
            <div className="report-section">
              <h4 className="report-section-title">2. Team Member Roster & Responsibilities</h4>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Student ID</th>
                    <th>Project Role</th>
                    <th>Core Responsibilities</th>
                    <th>Focus</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, idx) => (
                    <tr key={m.slug || idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{m.name}</strong></td>
                      <td className="mono-text">{m.id}</td>
                      <td><span className="report-role-pill">{m.role}</span></td>
                      <td style={{ fontSize: '11px', maxWidth: 260 }}>
                        {m.responsibilities.slice(0, 2).join('; ')}
                      </td>
                      <td style={{ fontSize: '11px' }}>
                        {m.focus?.[0] ? `${m.focus[0][0]} (${m.focus[0][1]}%)` : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 3: Supervisor Directives & Tasks Status */}
            <div className="report-section">
              <div className="report-section-header-flex">
                <h4 className="report-section-title">3. Supervisor Directives & Action Item Matrix</h4>
                <div className="report-stats-badges">
                  <span className="stat-pill done">Done: {completedTasks}</span>
                  <span className="stat-pill in-progress">In Progress: {inProgressTasks}</span>
                  <span className="stat-pill todo">To Do: {todoTasks}</span>
                </div>
              </div>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Directive / Action Item</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        {task.description && (
                          <div style={{ fontSize: '10.5px', color: '#555', marginTop: 2 }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td>{task.assignee}</td>
                      <td>
                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="mono-text">{task.dueDate}</td>
                      <td>
                        <span className={`status-tag ${task.status.toLowerCase()}`}>
                          {task.status === 'DONE' ? '✓ Completed' : task.status === 'IN_PROGRESS' ? '⚡ In Progress' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 4: Sprint Logs & Milestones */}
            <div className="report-section">
              <h4 className="report-section-title">4. Sprint Timeline & Completed Deliverables</h4>
              <div className="report-logs-list">
                {logs.slice(0, 4).map((log) => (
                  <div key={log.id} className="report-log-item">
                    <div className="report-log-header">
                      <strong>{log.week}: {log.title}</strong>
                      <span className="mono-text">{log.date || 'Active Sprint'}</span>
                    </div>
                    <ul className="report-highlights">
                      {(Array.isArray(log.highlights) ? log.highlights : []).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Sign-off & Faculty Endorsement */}
            <div className="report-section report-signoff-section">
              <h4 className="report-section-title">5. Verification & Academic Sign-Off</h4>
              <div className="report-signatures-grid">
                <div className="signature-box">
                  <div className="signature-line" />
                  <strong>Md Mahamudul Hasan</strong>
                  <span>Team Leader / Technical Lead</span>
                  <small>Team Random • FYDP</small>
                </div>
                <div className="signature-box">
                  <div className="signature-line" />
                  <strong>{projectData.supervisor.name}</strong>
                  <span>{projectData.supervisor.designation}, CSE</span>
                  <small>Project Supervisor • UIU</small>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="report-doc-footer">
              <span>Team Random Workspace Portal • Department of CSE • United International University</span>
              <span>Official FYDP Audit Report • Page 1 of 1</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
