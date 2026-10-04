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

// Helper: Get Supabase Service Client
async function getSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseSecretKey) {
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(supabaseUrl, supabaseSecretKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
    }
  } catch (e) {}
  return null;
}

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
// Database Mappers
// -------------------------------------------------------------
function mapDbMemberToApp(row) {
  if (!row) return null;
  return {
    slug: row.slug,
    id: row.student_id || row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || 'Not provided',
    gender: row.gender,
    department: row.department || 'Department of Computer Science & Engineering',
    institution: row.institution || 'United International University',
    role: row.role,
    shortRole: row.short_role || row.role,
    tagline: row.tagline || '',
    initials: row.initials || '',
    image: row.image || '',
    adminAvatarStyle: row.admin_avatar_style || 'glow',
    imagePosition: row.image_position || '50% 20%',
    imageFit: row.image_fit || 'cover',
    placeholder: row.placeholder || '',
    github: row.github || '',
    linkedin: row.linkedin || '',
    about: row.about || '',
    responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
    skills: Array.isArray(row.skills) ? row.skills : [],
    focus: Array.isArray(row.focus) ? row.focus : [],
    customLinks: Array.isArray(row.custom_links) ? row.custom_links : [],
    privacy: row.privacy || { email: true, phone: true, github: true, linkedin: true },
    displayOrder: row.display_order ?? 0
  };
}

// -------------------------------------------------------------
// Audit Log Dispatcher
// -------------------------------------------------------------
export async function recordAuditLog(action, details, session, type = 'GENERAL') {
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

    const supabase = await getSupabase();
    if (supabase) {
      supabase.from('audit_logs').insert({
        timestamp: newLog.timestamp,
        formatted_time: newLog.formattedTime,
        actor_name: newLog.actorName,
        actor_role: newLog.actorRole,
        action: newLog.action,
        details: newLog.details,
        type: newLog.type
      }).then(() => {}).catch(() => {});
    }

    return newLog;
  } catch (e) {
    console.error('Failed to record audit log', e);
  }
}

export async function getAllAuditLogs() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((l) => ({
          id: l.id,
          timestamp: l.timestamp,
          formattedTime: l.formatted_time,
          actorName: l.actor_name,
          actorRole: l.actor_role,
          action: l.action,
          details: l.details,
          type: l.type
        }));
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.auditLogs || [];
}

// -------------------------------------------------------------
// Members
// -------------------------------------------------------------
export async function getAllMembers() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(mapDbMemberToApp);
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.members;
}

export async function getMemberBySlug(slug) {
  if (!slug) {
    const members = await getAllMembers();
    return members[0] || null;
  }
  const clean = String(slug).trim().toLowerCase();

  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`slug.eq.${clean},student_id.eq.${clean},email.eq.${clean}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return mapDbMemberToApp(data);
      }
    }
  } catch (e) {}

  const state = getAppState();
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
  let current = await getMemberBySlug(slug);
  const memberIndex = state.members.findIndex((m) => m.slug === slug);
  if (!current && memberIndex !== -1) {
    current = state.members[memberIndex];
  }

  if (!current) {
    throw new Error('Member not found.');
  }

  const updatedRecord = {
    ...current,
    name: isAdmin ? (updateData.name || current.name) : current.name,
    tagline: updateData.tagline !== undefined ? updateData.tagline : current.tagline,
    about: updateData.about !== undefined ? updateData.about : current.about,
    phone: updateData.phone !== undefined ? updateData.phone : current.phone,
    github: updateData.github !== undefined ? updateData.github : current.github,
    linkedin: updateData.linkedin !== undefined ? updateData.linkedin : current.linkedin,
    customLinks: Array.isArray(updateData.customLinks) ? updateData.customLinks : (current.customLinks || []),
    privacy: updateData.privacy ? { ...(current.privacy || {}), ...updateData.privacy } : (current.privacy || { email: true, phone: true, github: true, linkedin: true }),
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

  if (memberIndex !== -1) {
    state.members[memberIndex] = updatedRecord;
  }
  saveAppState(state);

  // Cloud Supabase Persistence
  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('members').upsert(
        {
          slug: updatedRecord.slug,
          student_id: updatedRecord.id || null,
          name: updatedRecord.name,
          email: updatedRecord.email,
          phone: updatedRecord.phone || 'Not provided',
          gender: updatedRecord.gender || null,
          department: updatedRecord.department || 'Department of Computer Science & Engineering',
          institution: updatedRecord.institution || 'United International University',
          role: updatedRecord.role,
          short_role: updatedRecord.shortRole || null,
          tagline: updatedRecord.tagline || null,
          initials: updatedRecord.initials || null,
          image: updatedRecord.image || null,
          admin_avatar_style: updatedRecord.adminAvatarStyle || null,
          image_position: updatedRecord.imagePosition || null,
          image_fit: updatedRecord.imageFit || null,
          placeholder: updatedRecord.placeholder || null,
          github: updatedRecord.github || null,
          linkedin: updatedRecord.linkedin || null,
          about: updatedRecord.about || null,
          responsibilities: updatedRecord.responsibilities || [],
          skills: updatedRecord.skills || [],
          focus: updatedRecord.focus || [],
          custom_links: updatedRecord.customLinks || [],
          privacy: updatedRecord.privacy || { email: true, phone: true, github: true, linkedin: true },
          display_order: updatedRecord.displayOrder || 0,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'slug' }
      );
    }
  } catch (cloudErr) {
    console.error('Supabase profile sync warning:', cloudErr);
  }

  await recordAuditLog(
    'PROFILE_UPDATE',
    `Updated profile and portfolio details for ${current.name}`,
    session,
    'PROFILE'
  );

  return updatedRecord;
}

// -------------------------------------------------------------
// Timeline Sprint Logs
// -------------------------------------------------------------
export async function getAllLogs() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('sprint_logs')
        .select('*')
        .order('id', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((l) => ({
          id: l.id,
          week: l.week,
          title: l.title,
          date: l.date,
          status: l.status,
          category: l.category,
          author: l.author,
          highlights: Array.isArray(l.highlights) ? l.highlights : []
        }));
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.logs;
}

export async function createWeeklyLog(logData, session) {
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

  state.logs = [newLog, ...(state.logs || [])];
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('sprint_logs').insert({
        week: newLog.week,
        title: newLog.title,
        date: newLog.date,
        status: newLog.status,
        category: newLog.category,
        author: newLog.author,
        highlights: newLog.highlights
      });
    }
  } catch (e) {}

  await recordAuditLog(
    'SPRINT_LOG_CREATED',
    `Published public sprint progress entry: ${newLog.week} - ${newLog.title}`,
    session,
    'LOG'
  );

  return newLog;
}

export async function deleteWeeklyLog(logId, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Super Admin can delete sprint logs.');
  }

  const state = getAppState();
  const target = state.logs.find((l) => l.id === Number(logId) || l.id === logId);
  if (!target) return true;

  state.logs = state.logs.filter((l) => l.id !== Number(logId) && l.id !== logId);
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('sprint_logs').delete().eq('id', logId);
    }
  } catch (e) {}

  await recordAuditLog(
    'SPRINT_LOG_DELETED',
    `Deleted sprint log: ${target.week} - ${target.title}`,
    session,
    'LOG'
  );

  return true;
}

// -------------------------------------------------------------
// Team Notes
// -------------------------------------------------------------
export async function getAllNotes() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('team_notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((n) => ({
          id: n.id,
          author: n.author,
          authorRole: n.author_role,
          date: new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: n.title,
          content: n.content,
          tag: n.tag
        }));
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.notes;
}

export async function createTeamNote(noteData, session) {
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

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('team_notes').insert({
        author: newNote.author,
        author_role: newNote.authorRole,
        title: newNote.title,
        content: newNote.content,
        tag: newNote.tag
      });
    }
  } catch (e) {}

  await recordAuditLog(
    'NOTE_POSTED',
    `Posted internal note: '${newNote.title}' [Tag: ${newNote.tag}]`,
    session,
    'NOTE'
  );

  return newNote;
}

export async function deleteTeamNote(noteId, session) {
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

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('team_notes').delete().eq('id', noteId);
    }
  } catch (e) {}

  await recordAuditLog(
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
export async function getAllTasks() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          assignee: t.assignee,
          assigneeSlug: t.assignee_slug,
          priority: t.priority,
          dueDate: t.due_date,
          status: t.status,
          createdBy: t.created_by,
          createdAt: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.tasks || [];
}

export async function createDirectiveTask(taskData, session) {
  if (!session) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  const isAdmin = session.role === 'ADMIN';
  const isLead = session.roleTitle?.toLowerCase().includes('lead');

  if (!isAdmin && !isLead) {
    throw new Error('Forbidden: Only Project Admin / Technical Lead can create directives.');
  }

  if (!taskData.title?.trim()) {
    throw new Error('Task title is required.');
  }

  const state = getAppState();
  const newTask = {
    id: Date.now(),
    title: taskData.title.trim(),
    description: taskData.description?.trim() || '',
    assignee: taskData.assignee || 'Unassigned',
    assigneeSlug: taskData.assigneeSlug || null,
    priority: ['HIGH', 'MEDIUM', 'LOW'].includes(taskData.priority) ? taskData.priority : 'MEDIUM',
    dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    status: ['TODO', 'IN_PROGRESS', 'DONE'].includes(taskData.status) ? taskData.status : 'TODO',
    createdBy: session.roleTitle || session.name,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  state.tasks = [newTask, ...(state.tasks || [])];
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('tasks').insert({
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        assignee_slug: newTask.assigneeSlug,
        priority: newTask.priority,
        due_date: newTask.dueDate,
        status: newTask.status,
        created_by: newTask.createdBy
      });
    }
  } catch (e) {}

  await recordAuditLog(
    'TASK_CREATED',
    `Created directive task '${newTask.title}' assigned to ${newTask.assignee}`,
    session,
    'TASK'
  );

  return newTask;
}

export async function updateDirectiveTask(taskId, updateData, session) {
  if (!session) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  const state = getAppState();
  const taskIndex = state.tasks.findIndex((t) => t.id === Number(taskId) || t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Directive task not found.');
  }

  const current = state.tasks[taskIndex];
  const isAdmin = session.role === 'ADMIN';
  const isAssignee = current.assigneeSlug === session.slug || current.assignee === session.name;

  if (!isAdmin && !isAssignee) {
    throw new Error('Forbidden: You can only update tasks assigned to you.');
  }

  const updated = {
    ...current,
    ...(isAdmin ? updateData : { status: updateData.status || current.status })
  };

  state.tasks[taskIndex] = updated;
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('tasks').update({
        title: updated.title,
        description: updated.description,
        assignee: updated.assignee,
        assignee_slug: updated.assigneeSlug,
        priority: updated.priority,
        due_date: updated.dueDate,
        status: updated.status,
        updated_at: new Date().toISOString()
      }).eq('id', taskId);
    }
  } catch (e) {}

  if (updateData.status && updateData.status !== current.status) {
    await recordAuditLog(
      'TASK_STATUS_CHANGE',
      `Updated directive '${current.title}' to ${updateData.status}`,
      session,
      'TASK'
    );
  } else {
    await recordAuditLog(
      'TASK_UPDATED',
      `Modified directive details for '${current.title}'`,
      session,
      'TASK'
    );
  }

  return updated;
}

export async function deleteDirectiveTask(taskId, session) {
  if (!session) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Project Admin / Technical Lead can delete supervisor directives.');
  }

  const state = getAppState();
  const target = state.tasks.find((t) => t.id === Number(taskId) || t.id === taskId);
  if (!target) return true;

  state.tasks = state.tasks.filter((t) => t.id !== Number(taskId) && t.id !== taskId);
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('tasks').delete().eq('id', taskId);
    }
  } catch (e) {}

  await recordAuditLog(
    'TASK_DELETED',
    `Deleted directive task: '${target.title}'`,
    session,
    'TASK'
  );

  return true;
}

// -------------------------------------------------------------
// Banner Media Configuration
// -------------------------------------------------------------
export async function getBannerConfig() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('banner_config')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (!error && data) {
        return {
          mode: data.mode,
          videoUrl: data.video_url,
          imageUrl: data.image_url,
          headline: data.headline,
          tagline: data.tagline
        };
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.bannerConfig || {
    mode: 'auto',
    videoUrl: '/team-banner.mp4',
    imageUrl: '/team-banner.jpg',
    headline: 'Team Random',
    tagline: 'Engineering scalable software architecture & intelligent computing solutions.'
  };
}

export async function updateBannerConfig(newConfig, session) {
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Super Admin can update banner configuration.');
  }

  const current = await getBannerConfig();
  const updated = { ...current, ...newConfig };

  const state = getAppState();
  state.bannerConfig = updated;
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('banner_config').upsert({
        id: 1,
        mode: updated.mode,
        video_url: updated.videoUrl,
        image_url: updated.imageUrl,
        headline: updated.headline,
        tagline: updated.tagline,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {}

  await recordAuditLog(
    'BANNER_UPDATED',
    `Updated homepage banner media mode: [Mode: ${updated.mode}, Video: ${updated.videoUrl}]`,
    session,
    'SECURITY'
  );

  return updated;
}

// -------------------------------------------------------------
// Project Information
// -------------------------------------------------------------
export async function getProjectInfo() {
  try {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('project_info')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (!error && data) {
        return {
          title: data.title,
          shortTitle: data.short_title,
          domain: data.domain,
          status: data.status,
          progressPercent: data.progress_percent,
          supervisor: data.supervisor || {},
          abstract: data.abstract,
          techStack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
          milestones: Array.isArray(data.milestones) ? data.milestones : []
        };
      }
    }
  } catch (e) {}

  const state = getAppState();
  return state.projectInfo || { ...initialProjectData };
}

export async function updateProjectInfo(newInfo, session) {
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Project Admin / Lead can update project information.');
  }

  const current = await getProjectInfo();
  const updated = {
    ...current,
    ...newInfo,
    supervisor: {
      ...(current.supervisor || {}),
      ...(newInfo.supervisor || {})
    },
    techStack: Array.isArray(newInfo.techStack) ? newInfo.techStack : current.techStack,
    milestones: Array.isArray(newInfo.milestones) ? newInfo.milestones : current.milestones
  };

  const state = getAppState();
  state.projectInfo = updated;
  saveAppState(state);

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.from('project_info').upsert({
        id: 1,
        title: updated.title,
        short_title: updated.shortTitle || updated.title,
        domain: updated.domain,
        status: updated.status,
        progress_percent: updated.progressPercent || 0,
        supervisor: updated.supervisor,
        abstract: updated.abstract,
        tech_stack: updated.techStack,
        milestones: updated.milestones,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {}

  await recordAuditLog(
    'PROJECT_INFO_UPDATED',
    `Updated project thesis details: '${updated.title}' [Domain: ${updated.domain}]`,
    session,
    'SECURITY'
  );

  return updated;
}
