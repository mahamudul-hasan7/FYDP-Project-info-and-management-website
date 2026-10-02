import fs from 'fs';
import path from 'path';
import { members as initialMembers } from '../data/members';
import { projectLogs as initialLogs } from '../data/logs';

const APP_STORE_FILE = path.join(process.cwd(), 'data', '.app_store.json');

const INITIAL_NOTES = [
  {
    id: 1,
    author: 'Md Mahamudul Hasan',
    authorRole: 'Technical Lead',
    date: 'Oct 02, 2026',
    title: 'FYDP Phase 1 Architecture Checklist',
    content: 'Please ensure all frontend component designs follow mobile-first 16:9 compliance. The research team will finalize dataset benchmark tables by next Wednesday.',
    tag: 'Announcement'
  },
  {
    id: 2,
    author: 'Md Sabbir Hossen',
    authorRole: 'Presenter',
    date: 'Sep 28, 2026',
    title: 'Presentation Slide Deck Template Ready',
    content: 'Uploaded the draft slides for our upcoming supervisor consultation. Review the methodology section.',
    tag: 'Presentation'
  }
];

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Dataset Augmentation & Preprocessing Pipeline',
    description: 'Collect, clean and balance clinical records per supervisor directives from Week 03 consultation.',
    assignee: 'Md Mahamudul Hasan',
    assigneeSlug: 'md-mahamudul-hasan',
    priority: 'HIGH',
    dueDate: '2026-10-15',
    status: 'IN_PROGRESS',
    createdBy: 'Supervisor / Admin',
    createdAt: 'Oct 01, 2026'
  },
  {
    id: 2,
    title: 'Phase 1 Defense Slide Deck Architecture',
    description: 'Draft system block diagrams, algorithm flowchart, and preliminary evaluation graphs.',
    assignee: 'Md Sabbir Hossen',
    assigneeSlug: 'md-sabbir-hossen',
    priority: 'HIGH',
    dueDate: '2026-10-10',
    status: 'TODO',
    createdBy: 'Supervisor / Admin',
    createdAt: 'Oct 01, 2026'
  },
  {
    id: 3,
    title: 'Baseline Accuracy Benchmarking',
    description: 'Run ResNet50 and Vision Transformer baseline comparisons on validation split.',
    assignee: 'Tania Islam',
    assigneeSlug: 'tania-islam',
    priority: 'MEDIUM',
    dueDate: '2026-10-08',
    status: 'DONE',
    createdBy: 'Supervisor / Admin',
    createdAt: 'Sep 26, 2026'
  },
  {
    id: 4,
    title: 'GPU Compute Cluster Configuration',
    description: 'Set up remote CUDA environment and automated batch checkpoints for model training.',
    assignee: 'Rakibul Hasan',
    assigneeSlug: 'rakibul-hasan',
    priority: 'MEDIUM',
    dueDate: '2026-10-12',
    status: 'IN_PROGRESS',
    createdBy: 'Supervisor / Admin',
    createdAt: 'Sep 28, 2026'
  },
  {
    id: 5,
    title: 'Related Literature Survey Table',
    description: 'Compile taxonomy matrix of 10 recent IEEE/ACM publications in the domain.',
    assignee: 'Maria Tasnim',
    assigneeSlug: 'maria-tasnim',
    priority: 'LOW',
    dueDate: '2026-10-18',
    status: 'TODO',
    createdBy: 'Supervisor / Admin',
    createdAt: 'Oct 02, 2026'
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    formattedTime: 'Oct 01, 2026 • 10:30 AM',
    actorName: 'System Administrator',
    actorRole: 'ADMIN',
    action: 'SYSTEM_INITIALIZE',
    details: 'Encrypted persistent workspace database initialized with Super Admin access.',
    type: 'SECURITY'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    formattedTime: 'Oct 01, 2026 • 07:15 PM',
    actorName: 'Md Mahamudul Hasan',
    actorRole: 'Technical Lead',
    action: 'TASK_STATUS_CHANGE',
    details: "Updated directive 'Dataset Augmentation & Preprocessing Pipeline' to IN_PROGRESS",
    type: 'TASK'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    formattedTime: 'Oct 02, 2026 • 02:45 AM',
    actorName: 'Md Sabbir Hossen',
    actorRole: 'Presenter',
    action: 'NOTE_POSTED',
    details: "Published workspace note: 'Presentation Slide Deck Template Ready'",
    type: 'NOTE'
  }
];

function getAppState() {
  try {
    if (fs.existsSync(APP_STORE_FILE)) {
      const content = fs.readFileSync(APP_STORE_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (
        parsed &&
        Array.isArray(parsed.members) &&
        Array.isArray(parsed.logs) &&
        Array.isArray(parsed.notes)
      ) {
        if (!Array.isArray(parsed.tasks)) parsed.tasks = [...INITIAL_TASKS];
        if (!Array.isArray(parsed.auditLogs)) parsed.auditLogs = [...INITIAL_AUDIT_LOGS];
        globalThis.__APP_STATE__ = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // Fallback
  }

  if (globalThis.__APP_STATE__) {
    if (!Array.isArray(globalThis.__APP_STATE__.tasks)) {
      globalThis.__APP_STATE__.tasks = [...INITIAL_TASKS];
    }
    if (!Array.isArray(globalThis.__APP_STATE__.auditLogs)) {
      globalThis.__APP_STATE__.auditLogs = [...INITIAL_AUDIT_LOGS];
    }
    return globalThis.__APP_STATE__;
  }

  const initial = {
    members: [...initialMembers],
    logs: [...initialLogs],
    notes: [...INITIAL_NOTES],
    tasks: [...INITIAL_TASKS],
    auditLogs: [...INITIAL_AUDIT_LOGS]
  };

  globalThis.__APP_STATE__ = initial;
  saveAppState(initial);
  return initial;
}

function saveAppState(state) {
  globalThis.__APP_STATE__ = state;
  try {
    const dir = path.dirname(APP_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(APP_STORE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    try {
      const tmpFile = path.join('/tmp', '.app_store.json');
      fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf8');
    } catch {}
  }
}

// -------------------------------------------------------------
// Audit Log Dispatcher
// -------------------------------------------------------------
export function recordAuditLog(action, details, session, type = 'GENERAL') {
  try {
    const state = getAppState();
    const newLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      actorName: session ? session.name : 'System',
      actorRole: session ? (session.roleTitle || session.role) : 'SYSTEM',
      action,
      details,
      type
    };

    state.auditLogs = [newLog, ...(state.auditLogs || [])].slice(0, 100);
    saveAppState(state);
    return newLog;
  } catch (e) {
    console.error('Failed to record audit log', e);
  }
}

export function getAllAuditLogs() {
  const state = getAppState();
  return state.auditLogs || [];
}

// -------------------------------------------------------------
// Members
// -------------------------------------------------------------
export function getAllMembers() {
  const state = getAppState();
  return state.members;
}

export function getMemberBySlug(slug) {
  const state = getAppState();
  if (!slug) return state.members[0] || null;
  const clean = String(slug).trim().toLowerCase();
  return (
    state.members.find(
      (m) =>
        m.slug.toLowerCase() === clean ||
        (m.id && String(m.id).toLowerCase() === clean) ||
        (m.email && m.email.toLowerCase() === clean)
    ) ||
    initialMembers.find(
      (m) =>
        m.slug.toLowerCase() === clean ||
        (m.id && String(m.id).toLowerCase() === clean) ||
        (m.email && m.email.toLowerCase() === clean)
    ) ||
    state.members[0] ||
    null
  );
}

export function updateMemberProfile(slug, updateData, session) {
  if (!session) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  const isAdmin = session.role === 'ADMIN';
  const isSelf = session.slug === slug;

  if (!isAdmin && !isSelf) {
    throw new Error('Forbidden: You can only edit your own profile.');
  }

  const state = getAppState();
  const memberIndex = state.members.findIndex((m) => m.slug === slug);
  if (memberIndex === -1) {
    throw new Error('Member not found.');
  }

  const current = state.members[memberIndex];

  state.members[memberIndex] = {
    ...current,
    name: isAdmin ? (updateData.name || current.name) : current.name,
    tagline: updateData.tagline !== undefined ? updateData.tagline : current.tagline,
    about: updateData.about !== undefined ? updateData.about : current.about,
    phone: updateData.phone !== undefined ? updateData.phone : current.phone,
    github: updateData.github !== undefined ? updateData.github : current.github,
    linkedin: updateData.linkedin !== undefined ? updateData.linkedin : current.linkedin,
    skills: Array.isArray(updateData.skills) ? updateData.skills : current.skills,
    responsibilities: Array.isArray(updateData.responsibilities) ? updateData.responsibilities : current.responsibilities,
    focus: Array.isArray(updateData.focus) ? updateData.focus : current.focus,
    ...(isAdmin
      ? {
          name: updateData.name || current.name,
          role: updateData.role || current.role,
          shortRole: updateData.shortRole || current.shortRole,
          id: updateData.id || current.id,
          email: updateData.email || current.email,
          placeholder: updateData.placeholder !== undefined ? updateData.placeholder : current.placeholder
        }
      : {})
  };

  saveAppState(state);

  recordAuditLog(
    'PROFILE_UPDATE',
    `Updated profile and portfolio details for ${current.name}`,
    session,
    'PROFILE'
  );

  return state.members[memberIndex];
}

// -------------------------------------------------------------
// Timeline Sprint Logs
// -------------------------------------------------------------
export function getAllLogs() {
  const state = getAppState();
  return state.logs;
}

export function createWeeklyLog(logData, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Super Admin / Project Lead can publish official homepage sprint logs.');
  }

  const state = getAppState();
  const newLog = {
    id: Date.now(),
    week: logData.week || `Week 0${state.logs.length + 1}`,
    title: String(logData.title || 'Weekly Sprint Update').slice(0, 150),
    date: logData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: logData.status || 'active',
    category: logData.category || 'Engineering',
    author: session.name,
    highlights: (Array.isArray(logData.highlights) ? logData.highlights : [logData.highlights].filter(Boolean)).slice(0, 8)
  };

  state.logs = [newLog, ...state.logs];
  saveAppState(state);

  recordAuditLog(
    'TIMELINE_POSTED',
    `Published ${newLog.week}: '${newLog.title}' to homepage timeline`,
    session,
    'TIMELINE'
  );

  return newLog;
}

export function deleteWeeklyLog(logId, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Super Admin can delete timeline logs.');
  }

  const state = getAppState();
  const target = state.logs.find((l) => l.id === Number(logId) || l.id === logId);
  state.logs = state.logs.filter((l) => l.id !== Number(logId) && l.id !== logId);
  saveAppState(state);

  recordAuditLog(
    'TIMELINE_DELETED',
    `Deleted timeline log: '${target?.title || logId}'`,
    session,
    'TIMELINE'
  );

  return true;
}

// -------------------------------------------------------------
// Team Notes
// -------------------------------------------------------------
export function getAllNotes() {
  const state = getAppState();
  return state.notes;
}

export function createTeamNote(noteData, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const state = getAppState();
  const newNote = {
    id: Date.now(),
    author: session.name,
    authorRole: session.roleTitle || session.role,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    title: noteData.title || 'Team Update',
    content: noteData.content || '',
    tag: noteData.tag || 'General'
  };

  state.notes = [newNote, ...(state.notes || [])];
  saveAppState(state);

  recordAuditLog(
    'NOTE_POSTED',
    `Posted internal note: '${newNote.title}' [Tag: ${newNote.tag}]`,
    session,
    'NOTE'
  );

  return newNote;
}

export function deleteTeamNote(noteId, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const state = getAppState();
  const note = state.notes.find((n) => n.id === Number(noteId) || n.id === noteId);
  if (!note) return true;

  const isAdmin = session.role === 'ADMIN';
  const isAuthor = note.author === session.name;

  if (!isAdmin && !isAuthor) {
    throw new Error('Forbidden: You can only delete your own note.');
  }

  state.notes = state.notes.filter((n) => n.id !== Number(noteId) && n.id !== noteId);
  saveAppState(state);

  recordAuditLog(
    'NOTE_DELETED',
    `Removed internal team note: '${note.title}'`,
    session,
    'NOTE'
  );

  return true;
}

// -------------------------------------------------------------
// Supervisor Directives & Tasks (Kanban / Todo)
// -------------------------------------------------------------
export function getAllTasks() {
  const state = getAppState();
  return state.tasks || [];
}

export function createDirectiveTask(taskData, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const state = getAppState();
  const newTask = {
    id: Date.now(),
    title: taskData.title || 'New Directive Task',
    description: taskData.description || '',
    assignee: taskData.assignee || session.name,
    assigneeSlug: taskData.assigneeSlug || session.slug || '',
    priority: taskData.priority || 'MEDIUM', // HIGH, MEDIUM, LOW
    dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    status: taskData.status || 'TODO', // TODO, IN_PROGRESS, DONE
    createdBy: session.name,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  state.tasks = [newTask, ...(state.tasks || [])];
  saveAppState(state);

  recordAuditLog(
    'TASK_CREATED',
    `Created directive task: '${newTask.title}' assigned to ${newTask.assignee} [Priority: ${newTask.priority}]`,
    session,
    'TASK'
  );

  return newTask;
}

export function updateDirectiveTask(taskId, updateData, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const state = getAppState();
  const taskIndex = state.tasks.findIndex((t) => t.id === Number(taskId) || t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found.');
  }

  const prev = state.tasks[taskIndex];
  const updated = {
    ...prev,
    title: updateData.title !== undefined ? updateData.title : prev.title,
    description: updateData.description !== undefined ? updateData.description : prev.description,
    assignee: updateData.assignee !== undefined ? updateData.assignee : prev.assignee,
    assigneeSlug: updateData.assigneeSlug !== undefined ? updateData.assigneeSlug : prev.assigneeSlug,
    priority: updateData.priority !== undefined ? updateData.priority : prev.priority,
    dueDate: updateData.dueDate !== undefined ? updateData.dueDate : prev.dueDate,
    status: updateData.status !== undefined ? updateData.status : prev.status
  };

  state.tasks[taskIndex] = updated;
  saveAppState(state);

  if (prev.status !== updated.status) {
    recordAuditLog(
      'TASK_STATUS_CHANGE',
      `Task '${updated.title}' moved from ${prev.status} ➔ ${updated.status}`,
      session,
      'TASK'
    );
  } else {
    recordAuditLog(
      'TASK_UPDATED',
      `Updated directive task details: '${updated.title}'`,
      session,
      'TASK'
    );
  }

  return updated;
}

export function deleteDirectiveTask(taskId, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const isAdmin = session.role === 'ADMIN';
  const state = getAppState();
  const target = state.tasks.find((t) => t.id === Number(taskId) || t.id === taskId);
  if (!target) return true;

  const isCreator = target.createdBy === session.name;
  if (!isAdmin && !isCreator) {
    throw new Error('Forbidden: Only Super Admin or the task creator can delete this directive.');
  }

  state.tasks = state.tasks.filter((t) => t.id !== Number(taskId) && t.id !== taskId);
  saveAppState(state);

  recordAuditLog(
    'TASK_DELETED',
    `Deleted directive task: '${target.title}'`,
    session,
    'TASK'
  );

  return true;
}

// -------------------------------------------------------------
// Banner Media Configuration (Video / Image / Stream)
// -------------------------------------------------------------
export function getBannerConfig() {
  const state = getAppState();
  return state.bannerConfig || {
    mode: 'auto', // 'video' | 'image' | 'auto'
    videoUrl: '/team-banner.mp4',
    imageUrl: '/team-banner.jpg',
    headline: 'Team Random',
    tagline: 'Engineering scalable software architecture & intelligent computing solutions.'
  };
}

export function updateBannerConfig(newConfig, session) {
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Super Admin can update banner configuration.');
  }

  const state = getAppState();
  state.bannerConfig = {
    ...getBannerConfig(),
    ...newConfig
  };
  saveAppState(state);

  recordAuditLog(
    'BANNER_UPDATED',
    `Updated homepage banner media mode: [Mode: ${state.bannerConfig.mode}, Video: ${state.bannerConfig.videoUrl}]`,
    session,
    'SECURITY'
  );

  return state.bannerConfig;
}
