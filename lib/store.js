import fs from 'fs';
import path from 'path';
import { members as initialMembers } from '../data/members';
import { projectLogs as initialLogs } from '../data/logs';
import { projectData as initialProjectData } from '../data/project';

const APP_STORE_FILE = path.join(process.cwd(), 'data', '.app_store.json');

const INITIAL_NOTES = [
  {
    id: 1,
    author: 'Md Mahamudul Hasan',
    authorRole: 'Technical Lead',
    date: 'Oct 02, 2026',
    title: 'FYDP Phase 1 Workspace & Architecture Update',
    content: 'Team collaboration workspace is live with persistent database syncing. All members please update your respective literature review summaries and task progress.',
    tag: 'Announcement'
  },
  {
    id: 2,
    author: 'Md Sabbir Hossen',
    authorRole: 'Faculty Communicator',
    date: 'Sep 28, 2026',
    title: 'Upcoming Supervisor Consultation Preparation',
    content: 'Please submit your domain survey points by Tuesday so we can compile a comprehensive discussion brief for our faculty mentor meeting.',
    tag: 'Consultation'
  }
];

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'FYDP Topic Brainstorming & Candidate Domain Matrix',
    description: 'Explore and evaluate 3 candidate project domains against UIU CSE technical and research guidelines.',
    assignee: 'Md Mahamudul Hasan',
    assigneeSlug: 'md-mahamudul-hasan',
    priority: 'HIGH',
    dueDate: '2026-10-15',
    status: 'IN_PROGRESS',
    createdBy: 'Technical Lead',
    createdAt: 'Oct 01, 2026'
  },
  {
    id: 2,
    title: 'Supervisor Consultation Meeting Agenda & Pitch Deck',
    description: 'Prepare structured meeting agenda, prospective research problem statements, and preliminary slides for faculty consultation.',
    assignee: 'Md Sabbir Hossen',
    assigneeSlug: 'md-sabbir-hossen',
    priority: 'HIGH',
    dueDate: '2026-10-10',
    status: 'IN_PROGRESS',
    createdBy: 'Technical Lead',
    createdAt: 'Oct 01, 2026'
  },
  {
    id: 3,
    title: 'State-of-the-Art Literature Review & Paper Benchmarking',
    description: 'Survey 15+ recent IEEE/ACM publications (2022–2026) to extract research gaps and methodology feasibility.',
    assignee: 'Tania Islam',
    assigneeSlug: 'tania-islam',
    priority: 'HIGH',
    dueDate: '2026-10-08',
    status: 'DONE',
    createdBy: 'Technical Lead',
    createdAt: 'Sep 26, 2026'
  },
  {
    id: 4,
    title: 'Citation Management & Reference Repository Setup',
    description: 'Organize literature references into structured BibTeX/Mendeley repository and prepare Related Works taxonomy notes.',
    assignee: 'Maria Tasnim',
    assigneeSlug: 'maria-tasnim',
    priority: 'MEDIUM',
    dueDate: '2026-10-18',
    status: 'TODO',
    createdBy: 'Technical Lead',
    createdAt: 'Oct 02, 2026'
  },
  {
    id: 5,
    title: 'FYDP Phase 1 Defense Template & Presentation Rehearsal',
    description: 'Draft preliminary proposal slide structure and coordinate team presentation delivery rehearsal.',
    assignee: 'Rehnuma Khan',
    assigneeSlug: 'rehnuma-khan',
    priority: 'LOW',
    dueDate: '2026-10-20',
    status: 'TODO',
    createdBy: 'Technical Lead',
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
    details: "Updated directive 'FYDP Topic Brainstorming & Candidate Domain Matrix' to IN_PROGRESS",
    type: 'TASK'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    formattedTime: 'Oct 02, 2026 • 02:45 AM',
    actorName: 'Md Sabbir Hossen',
    actorRole: 'Faculty Communicator',
    action: 'NOTE_POSTED',
    details: "Published workspace note: 'Upcoming Supervisor Consultation Preparation'",
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

export async function updateMemberProfile(slug, updateData, session) {
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
    customLinks: Array.isArray(updateData.customLinks) ? updateData.customLinks : (current.customLinks || []),
    privacy: updateData.privacy ? { ...(current.privacy || {}), ...updateData.privacy } : (current.privacy || { email: true, phone: false, github: true, linkedin: true }),
    skills: Array.isArray(updateData.skills) ? updateData.skills : current.skills,
    responsibilities: Array.isArray(updateData.responsibilities) ? updateData.responsibilities : current.responsibilities,
    focus: Array.isArray(updateData.focus) ? updateData.focus : current.focus,
    image: updateData.image !== undefined ? updateData.image : current.image,
    adminAvatarStyle: updateData.adminAvatarStyle !== undefined ? updateData.adminAvatarStyle : current.adminAvatarStyle,
    imagePosition: updateData.imagePosition !== undefined ? updateData.imagePosition : current.imagePosition,
    imageFit: updateData.imageFit !== undefined ? updateData.imageFit : current.imageFit,
    placeholder: updateData.placeholder !== undefined ? updateData.placeholder : current.placeholder,
    ...(isAdmin
      ? {
          name: updateData.name || current.name,
          role: updateData.role || current.role,
          shortRole: updateData.shortRole || current.shortRole,
          id: updateData.id || current.id,
          email: updateData.email || current.email
        }
      : {})
  };

  saveAppState(state);

  // Cloud Supabase Persistence
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseSecretKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseSecretKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const updatedMem = state.members[memberIndex];
      await supabase.from('members').upsert(
        {
          slug: updatedMem.slug,
          student_id: updatedMem.id || null,
          name: updatedMem.name,
          email: updatedMem.email,
          phone: updatedMem.phone || 'Not provided',
          gender: updatedMem.gender || null,
          department: updatedMem.department || 'Department of Computer Science & Engineering',
          institution: updatedMem.institution || 'United International University',
          role: updatedMem.role,
          short_role: updatedMem.shortRole || null,
          tagline: updatedMem.tagline || null,
          initials: updatedMem.initials || null,
          image: updatedMem.image || null,
          admin_avatar_style: updatedMem.adminAvatarStyle || null,
          image_position: updatedMem.imagePosition || null,
          image_fit: updatedMem.imageFit || null,
          placeholder: updatedMem.placeholder || null,
          github: updatedMem.github || null,
          linkedin: updatedMem.linkedin || null,
          about: updatedMem.about || null,
          responsibilities: updatedMem.responsibilities || [],
          skills: updatedMem.skills || [],
          focus: updatedMem.focus || [],
          custom_links: updatedMem.customLinks || [],
          privacy: updatedMem.privacy || { email: true, phone: true, github: true, linkedin: true },
          display_order: updatedMem.displayOrder || 0,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'slug' }
      );
    }
  } catch (cloudErr) {
    console.error('Supabase profile sync warning:', cloudErr);
  }

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
    throw new Error('Unauthorized: You must be logged in.');
  }

  // RBAC: Only ADMIN / Project Lead can create and assign supervisor directives
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Project Admin / Technical Lead can create and assign supervisor directives.');
  }

  const state = getAppState();
  const newTask = {
    id: Date.now(),
    title: String(taskData.title || 'New Directive Task').slice(0, 150),
    description: String(taskData.description || '').slice(0, 500),
    assignee: taskData.assignee || session.name,
    assigneeSlug: taskData.assigneeSlug || session.slug || '',
    priority: ['HIGH', 'MEDIUM', 'LOW'].includes(taskData.priority) ? taskData.priority : 'MEDIUM',
    dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    status: ['TODO', 'IN_PROGRESS', 'DONE'].includes(taskData.status) ? taskData.status : 'TODO',
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
    throw new Error('Unauthorized: You must be logged in.');
  }

  const state = getAppState();
  const taskIndex = state.tasks.findIndex((t) => t.id === Number(taskId) || t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found.');
  }

  const prev = state.tasks[taskIndex];
  const isAdmin = session.role === 'ADMIN';
  const isAssignee =
    (prev.assigneeSlug && String(prev.assigneeSlug).toLowerCase() === String(session.slug || '').toLowerCase()) ||
    (prev.assignee && String(prev.assignee).toLowerCase() === String(session.name || '').toLowerCase());

  // RBAC Check: Must be Admin OR the assigned team member
  if (!isAdmin && !isAssignee) {
    throw new Error('Forbidden: You do not have permission to modify this task. It is assigned to ' + prev.assignee);
  }

  // RBAC Field Validation: Non-admin assigned members can ONLY update status
  if (!isAdmin && isAssignee) {
    const attemptedAdminFields = ['title', 'description', 'assignee', 'assigneeSlug', 'priority', 'dueDate'].filter(
      (field) => updateData[field] !== undefined && updateData[field] !== prev[field]
    );

    if (attemptedAdminFields.length > 0) {
      throw new Error(`Forbidden: Assigned members can only update task progress status (cannot modify ${attemptedAdminFields.join(', ')}).`);
    }

    if (updateData.status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(updateData.status)) {
      throw new Error('Invalid task status. Must be TODO, IN_PROGRESS, or DONE.');
    }
  }

  const updated = {
    ...prev,
    title: isAdmin && updateData.title !== undefined ? String(updateData.title).slice(0, 150) : prev.title,
    description: isAdmin && updateData.description !== undefined ? String(updateData.description).slice(0, 500) : prev.description,
    assignee: isAdmin && updateData.assignee !== undefined ? updateData.assignee : prev.assignee,
    assigneeSlug: isAdmin && updateData.assigneeSlug !== undefined ? updateData.assigneeSlug : prev.assigneeSlug,
    priority: isAdmin && updateData.priority !== undefined && ['HIGH', 'MEDIUM', 'LOW'].includes(updateData.priority) ? updateData.priority : prev.priority,
    dueDate: isAdmin && updateData.dueDate !== undefined ? updateData.dueDate : prev.dueDate,
    status: updateData.status !== undefined && ['TODO', 'IN_PROGRESS', 'DONE'].includes(updateData.status) ? updateData.status : prev.status
  };

  state.tasks[taskIndex] = updated;
  saveAppState(state);

  if (prev.status !== updated.status) {
    recordAuditLog(
      'TASK_STATUS_CHANGE',
      `Task '${updated.title}' moved from ${prev.status} ➔ ${updated.status} by ${session.name}`,
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
    throw new Error('Unauthorized: You must be logged in.');
  }

  // RBAC: Only Admin / Lead can delete tasks
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Project Admin / Technical Lead can delete supervisor directives.');
  }

  const state = getAppState();
  const target = state.tasks.find((t) => t.id === Number(taskId) || t.id === taskId);
  if (!target) return true;

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

// -------------------------------------------------------------
// Project Information & Research Scope Management
// -------------------------------------------------------------
export function getProjectInfo() {
  const state = getAppState();
  return state.projectInfo || { ...initialProjectData };
}

export function updateProjectInfo(newInfo, session) {
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Project Admin / Lead can update project information.');
  }

  const state = getAppState();
  const current = getProjectInfo();
  state.projectInfo = {
    ...current,
    ...newInfo,
    supervisor: {
      ...(current.supervisor || {}),
      ...(newInfo.supervisor || {})
    },
    techStack: Array.isArray(newInfo.techStack) ? newInfo.techStack : current.techStack,
    milestones: Array.isArray(newInfo.milestones) ? newInfo.milestones : current.milestones
  };
  saveAppState(state);

  recordAuditLog(
    'PROJECT_INFO_UPDATED',
    `Updated project thesis details: '${state.projectInfo.title}' [Domain: ${state.projectInfo.domain}]`,
    session,
    'SECURITY'
  );

  return state.projectInfo;
}
