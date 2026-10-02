'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BellOff,
  BellRing,
  Briefcase,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Code2,
  Crown,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Github,
  History,
  KeyRound,
  Layers,
  LayoutDashboard,
  Linkedin,
  ListTodo,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  Printer,
  Radio,
  Save,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Trash2,
  Unlock,
  User,
  UserCheck,
  UserRound,
  Users,
  Video,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import MemberAvatar from '../../components/MemberAvatar';

export default function PortalPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Editor state
  const [allMembers, setAllMembers] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [editingSection, setEditingSection] = useState(null);

  // Weekly Logs state
  const [logs, setLogs] = useState([]);
  const [newLogWeek, setNewLogWeek] = useState('');
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogCategory, setNewLogCategory] = useState('Engineering');
  const [newLogHighlights, setNewLogHighlights] = useState('');
  const [logPosting, setLogPosting] = useState(false);
  const [logMessage, setLogMessage] = useState('');

  // Supervisor Directives & Tasks state
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('HIGH');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [taskPosting, setTaskPosting] = useState(false);
  const [taskMessage, setTaskMessage] = useState('');

  // Team Notes state
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Meeting Note');
  const [notePosting, setNotePosting] = useState(false);
  const [noteMessage, setNoteMessage] = useState('');

  // Security & Password state
  const [pwdTargetSlug, setPwdTargetSlug] = useState('');
  const [pwdOld, setPwdOld] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdMessageType, setPwdMessageType] = useState('');

  // Activity Audit Logs & Live Notifications state
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [toasts, setToasts] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('ALL');
  const [readNotifIds, setReadNotifIds] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Banner Media state (Video / Image)
  const [bannerConfig, setBannerConfig] = useState({
    mode: 'auto',
    videoUrl: '/team-banner.mp4',
    imageUrl: '/team-banner.jpg',
    headline: 'Team Random',
    tagline: 'Engineering scalable software architecture & intelligent computing solutions.'
  });
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  // Rapid Broadcast & Logical Operations Console state
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastTag, setBroadcastTag] = useState('Meeting Note');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState('');
  const [agendaCopied, setAgendaCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const notifPopoverRef = useRef(null);
  const knownAuditIdsRef = useRef(new Set());
  const isInitialAuditLoadedRef = useRef(false);

  // Synthesize pleasant ambient notification sound
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio autoplay permission or Web Audio unavailable
    }
  };

  // Close notification popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifPopoverRef.current && !notifPopoverRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  // Load persistent read notifications and sound settings
  useEffect(() => {
    if (session?.slug) {
      try {
        const storedRead = localStorage.getItem(`team_random_read_notifs_${session.slug}`);
        if (storedRead) {
          setReadNotifIds(JSON.parse(storedRead));
        }
        const storedSound = localStorage.getItem('team_random_notif_sound');
        if (storedSound !== null) {
          setSoundEnabled(storedSound === 'true');
        }
      } catch (e) {}
    }
  }, [session]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('team_random_notif_sound', String(next));
    } catch (e) {}
    if (next) {
      playNotificationChime();
    }
  };

  const markAllNotifsAsRead = () => {
    const allIds = auditLogs.map((l) => l.id);
    setReadNotifIds(allIds);
    if (session?.slug) {
      try {
        localStorage.setItem(`team_random_read_notifs_${session.slug}`, JSON.stringify(allIds));
      } catch (e) {}
    }
  };

  const toggleMarkSingleRead = (e, logId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    let nextRead;
    if (readNotifIds.includes(logId)) {
      nextRead = readNotifIds.filter((id) => id !== logId);
    } else {
      nextRead = [...readNotifIds, logId];
    }
    setReadNotifIds(nextRead);
    if (session?.slug) {
      try {
        localStorage.setItem(`team_random_read_notifs_${session.slug}`, JSON.stringify(nextRead));
      } catch (e) {}
    }
  };

  const getNotificationDisplayData = (item) => {
    const isAssignedToMe = Boolean(
      session &&
      ((item.details && (item.details.includes(session.name) || (session.slug && item.details.includes(session.slug)))) ||
       item.assigneeSlug === session.slug ||
       item.assignee === session.name) &&
      item.type === 'TASK'
    );

    let categoryLabel = 'Workspace Activity';
    let headline = item.action ? item.action.replace(/_/g, ' ') : 'Activity Update';
    let actionBadge = null;
    let quickAction = 'Open Board';

    if (item.type === 'TASK') {
      categoryLabel = 'Directive';
      quickAction = 'View Task';
      if (isAssignedToMe) {
        headline = item.action === 'TASK_CREATED' ? 'New Directive Assigned To You' : 'Status Updated on Your Directive';
        actionBadge = '⚡ For You';
      } else {
        headline = item.action === 'TASK_CREATED' ? 'New Directive Assigned' : 'Directive Status Updated';
      }
    } else if (item.type === 'NOTE') {
      categoryLabel = 'Team Note';
      headline = 'Team Note Shared';
      quickAction = 'Open Notes';
    } else if (item.type === 'TIMELINE') {
      categoryLabel = 'Sprint Log';
      headline = 'Sprint Milestone Published';
      quickAction = 'View Sprint Logs';
    } else if (item.type === 'SECURITY') {
      categoryLabel = 'Security';
      headline = 'Security & Access Event';
      quickAction = 'Check Security';
    } else if (item.type === 'PROFILE') {
      categoryLabel = 'Profile';
      headline = 'Profile Updated';
      quickAction = 'View Profile';
    }

    return { isAssignedToMe, categoryLabel, headline, actionBadge, quickAction };
  };

  const handleNotificationClick = (log) => {
    if (!readNotifIds.includes(log.id)) {
      const nextRead = [...readNotifIds, log.id];
      setReadNotifIds(nextRead);
      if (session?.slug) {
        try {
          localStorage.setItem(`team_random_read_notifs_${session.slug}`, JSON.stringify(nextRead));
        } catch (e) {}
      }
    }

    let target = 'tasks';
    if (log.type === 'TASK') {
      target = 'tasks';
      setTaskFilter('ALL');
    } else if (log.type === 'NOTE') {
      target = 'notes';
    } else if (log.type === 'TIMELINE') {
      target = 'logs';
    } else if (log.type === 'PROFILE' || log.type === 'SECURITY') {
      target = session?.role === 'ADMIN' ? 'admin' : 'security';
    }

    setActiveTab(target);
    setIsNotifOpen(false);
  };

  const dismissToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const triggerToastNotification = (log) => {
    // Suppress toasts for the user's own actions
    if (session && (log.actorName === session.name || log.actorUsername === session.username)) {
      return;
    }

    let targetTab = 'tasks';
    let tagLabel = 'Workspace Activity';
    let title = log.action ? log.action.replace(/_/g, ' ') : 'Activity Alert';

    const isAssignedToMe = Boolean(
      session &&
      ((log.details && (log.details.includes(session.name) || (session.slug && log.details.includes(session.slug)))) ||
       log.assigneeSlug === session.slug ||
       log.assignee === session.name) &&
      log.type === 'TASK'
    );

    if (log.type === 'TASK') {
      targetTab = 'tasks';
      if (isAssignedToMe) {
        tagLabel = '⚡ Directive For You';
        title = log.action === 'TASK_CREATED' ? 'New Directive Assigned To You' : 'Status Updated on Your Directive';
      } else {
        tagLabel = 'Directives & Tasks';
        title = log.action === 'TASK_CREATED' ? 'New Directive Assigned' : 'Task Status Updated';
      }
    } else if (log.type === 'NOTE') {
      targetTab = 'notes';
      tagLabel = 'Team Note';
      title = 'New Team Note Shared';
    } else if (log.type === 'TIMELINE') {
      targetTab = 'logs';
      tagLabel = 'Sprint Timeline';
      title = 'Sprint Log Published';
    } else if (log.type === 'SECURITY' || log.type === 'PROFILE') {
      targetTab = session?.role === 'ADMIN' ? 'admin' : 'security';
      tagLabel = 'Security & Audit';
      title = log.type === 'SECURITY' ? 'Security Event' : 'Profile Updated';
    }

    const toastId = `${log.id}-${Date.now()}`;
    const newToast = {
      id: toastId,
      logId: log.id,
      title,
      message: log.details || '',
      actorName: log.actorName || 'Team Member',
      actorRole: log.actorRole || 'MEMBER',
      type: log.type || 'TASK',
      tagLabel,
      targetTab,
      isForMe: isAssignedToMe,
      createdAt: Date.now()
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 2)]);

    if (soundEnabled) {
      playNotificationChime();
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4500);
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 30) return 'Just now';
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recent';
    }
  };

  // Check auth session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data?.authenticated) {
          router.push('/login');
          return;
        }
        setSession(data.user);
        const initialSlug = data.user.role === 'ADMIN' ? 'md-mahamudul-hasan' : data.user.slug;
        setSelectedSlug(initialSlug);
        setPwdTargetSlug(data.user.slug);
        setNewTaskAssignee(data.user.name);
        loadProfile(initialSlug);
        loadLogs();
        loadTasks();
        loadNotes();
        loadAuditLogs();
        loadBannerConfig();
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Realtime Live Heartbeat Polling for Team Notes, Tasks, Logs & Audit
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      loadNotes();
      loadTasks();
      loadLogs();
      loadAuditLogs();
    }, 3000);

    const handleFocus = () => {
      loadNotes();
      loadTasks();
      loadLogs();
      loadAuditLogs();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [session]);

  // Load Profile
  const loadProfile = async (slug) => {
    try {
      const res = await fetch(`/api/portal/profile?slug=${slug}`);
      const data = await res.json();
      if (data.success) {
        setProfileData(data.member);
        if (data.allMembers) {
          setAllMembers(data.allMembers);
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  // Load Logs
  const loadLogs = async () => {
    try {
      const res = await fetch('/api/portal/logs');
      const data = await res.json();
      if (data.success) setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to load logs', err);
    }
  };

  // Load Tasks
  const loadTasks = async () => {
    try {
      const res = await fetch('/api/portal/tasks');
      const data = await res.json();
      if (data.success) setTasks(data.tasks || []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  // Load Notes
  const loadNotes = async () => {
    try {
      const res = await fetch('/api/portal/notes');
      const data = await res.json();
      if (data.success) setNotes(data.notes || []);
    } catch (err) {
      console.error('Failed to load notes', err);
    }
  };

  // Load Audit Logs & Real-time Live Notifications
  const loadAuditLogs = async () => {
    try {
      const res = await fetch('/api/portal/audit');
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setAuditLogs(data.logs);

        // First load: initialize known IDs
        if (!isInitialAuditLoadedRef.current) {
          data.logs.forEach((log) => knownAuditIdsRef.current.add(log.id));
          isInitialAuditLoadedRef.current = true;
        } else {
          // Subsequent heartbeat polls: detect newly arrived events
          const newEntries = data.logs.filter((log) => !knownAuditIdsRef.current.has(log.id));
          if (newEntries.length > 0) {
            newEntries.forEach((log) => {
              knownAuditIdsRef.current.add(log.id);
              triggerToastNotification(log);
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  // Load Banner Config
  const loadBannerConfig = async () => {
    try {
      const res = await fetch('/api/portal/banner');
      const data = await res.json();
      if (data.success && data.config) {
        setBannerConfig(data.config);
      }
    } catch (e) {}
  };

  // Save Banner Media Config (Admin only)
  const handleSaveBannerConfig = async (e) => {
    if (e) e.preventDefault();
    setBannerSaving(true);
    setBannerMessage('');

    try {
      const res = await fetch('/api/portal/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerConfig)
      });
      const data = await res.json();
      if (data.success) {
        setBannerMessage('✓ Banner media settings updated successfully!');
        loadAuditLogs();
        setTimeout(() => setBannerMessage(''), 3500);
      } else {
        setBannerMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setBannerMessage('Failed to save banner settings.');
    } finally {
      setBannerSaving(false);
    }
  };

  // Switch edited member (Admin only)
  const handleMemberChange = (slug) => {
    setSelectedSlug(slug);
    setProfileMessage('');
    loadProfile(slug);
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');

    try {
      const res = await fetch('/api/portal/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedSlug,
          ...profileData
        })
      });

      const data = await res.json();
      if (data.success) {
        setProfileMessage('✓ Changes saved successfully!');
        setEditingSection(null);
        loadAuditLogs();
        setTimeout(() => setProfileMessage(''), 3500);
      } else {
        setProfileMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setProfileMessage('Error saving profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Publish Sprint Log
  const handlePublishLog = async (e) => {
    e.preventDefault();
    if (!newLogTitle || !newLogHighlights) return;
    setLogPosting(true);
    setLogMessage('');

    const highlightsList = newLogHighlights
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/portal/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: newLogWeek || `Week 0${logs.length + 1}`,
          title: newLogTitle,
          category: newLogCategory,
          highlights: highlightsList
        })
      });

      const data = await res.json();
      if (data.success) {
        setLogMessage('✓ Weekly sprint log published to homepage timeline!');
        setNewLogTitle('');
        setNewLogWeek('');
        setNewLogHighlights('');
        loadLogs();
        loadAuditLogs();
        setTimeout(() => setLogMessage(''), 3500);
      }
    } catch (err) {
      setLogMessage('Failed to post log.');
    } finally {
      setLogPosting(false);
    }
  };

  // Delete Log
  const handleDeleteLog = async (id) => {
    if (!confirm('Delete this sprint log?')) return;
    try {
      const res = await fetch(`/api/portal/logs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadLogs();
        loadAuditLogs();
      }
    } catch (err) {
      console.error('Failed to delete log', err);
    }
  };

  // Create Task / Directive
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setTaskPosting(true);
    setTaskMessage('');

    try {
      const selectedMember = allMembers.find((m) => m.name === newTaskAssignee);
      const res = await fetch('/api/portal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          assignee: newTaskAssignee || session.name,
          assigneeSlug: selectedMember?.slug || session.slug,
          priority: newTaskPriority,
          dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
          status: 'TODO'
        })
      });

      const data = await res.json();
      if (data.success) {
        setTaskMessage('✓ Directive task added to workspace board!');
        setNewTaskTitle('');
        setNewTaskDesc('');
        loadTasks();
        loadAuditLogs();
        setTimeout(() => setTaskMessage(''), 3500);
      } else {
        setTaskMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setTaskMessage('Failed to create task.');
    } finally {
      setTaskPosting(false);
    }
  };

  // Update Task Status
  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/portal/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        loadTasks();
        loadAuditLogs();
      }
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    if (!confirm('Delete this directive task?')) return;
    try {
      const res = await fetch(`/api/portal/tasks?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadTasks();
        loadAuditLogs();
      }
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  // Post Note
  const handlePostNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    setNotePosting(true);
    setNoteMessage('');

    try {
      const res = await fetch('/api/portal/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
          tag: newNoteTag
        })
      });

      const data = await res.json();
      if (data.success) {
        setNoteMessage('✓ Team note published to workspace feed!');
        setNewNoteTitle('');
        setNewNoteContent('');
        loadNotes();
        loadAuditLogs();
        setTimeout(() => setNoteMessage(''), 3500);
      } else {
        setNoteMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Failed to post note', err);
      setNoteMessage('Failed to post note.');
    } finally {
      setNotePosting(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id) => {
    if (!confirm('Delete this team note?')) return;
    try {
      const res = await fetch(`/api/portal/notes?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNoteMessage('✓ Team note deleted.');
        loadNotes();
        loadAuditLogs();
        setTimeout(() => setNoteMessage(''), 3000);
      } else {
        alert(data.message || 'Failed to delete note');
      }
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage('');

    if (pwdNew.length < 6) {
      setPwdMessage('New password must be at least 6 characters long.');
      setPwdMessageType('error');
      return;
    }

    if (pwdNew !== pwdConfirm) {
      setPwdMessage('New password and confirmation do not match.');
      setPwdMessageType('error');
      return;
    }

    setPwdSaving(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: pwdTargetSlug,
          oldPassword: pwdOld,
          newPassword: pwdNew
        })
      });

      const data = await res.json();
      if (data.success) {
        setPwdMessage('✓ Password updated successfully!');
        setPwdMessageType('success');
        setPwdOld('');
        setPwdNew('');
        setPwdConfirm('');
        loadAuditLogs();
        setTimeout(() => setPwdMessage(''), 4000);
      } else {
        setPwdMessage(`Error: ${data.message || 'Failed to update password.'}`);
        setPwdMessageType('error');
      }
    } catch (err) {
      setPwdMessage('Failed to update password. Please check connection.');
      setPwdMessageType('error');
    } finally {
      setPwdSaving(false);
    }
  };

  // Logout with full reload to clear state
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <main className="app-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '65vh' }}>
        <div className="simple-spinner" />
      </main>
    );
  }

  if (!session) return null;

  const isAdmin = session.role === 'ADMIN';

  // Filtered tasks for Kanban board
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'ALL') return true;
    return t.status === taskFilter;
  });

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter((l) => {
    if (auditFilter === 'ALL') return true;
    return l.type === auditFilter;
  });

  // Notification counts and filtering logic
  const unreadNotifCount = auditLogs.filter((l) => !readNotifIds.includes(l.id)).length;
  const forMeCount = auditLogs.filter((l) => {
    return session &&
      ((l.details && (l.details.includes(session.name) || (session.slug && l.details.includes(session.slug)))) ||
       l.assigneeSlug === session.slug ||
       l.assignee === session.name) &&
      l.type === 'TASK';
  }).length;

  const filteredNotifs = auditLogs.filter((l) => {
    if (notifFilter === 'ALL') return true;
    if (notifFilter === 'UNREAD') return !readNotifIds.includes(l.id);
    if (notifFilter === 'FOR_ME') {
      return session &&
        ((l.details && (l.details.includes(session.name) || (session.slug && l.details.includes(session.slug)))) ||
         l.assigneeSlug === session.slug ||
         l.assignee === session.name) &&
        l.type === 'TASK';
    }
    return l.type === notifFilter;
  });

  // Personal user stats for the Executive Metrics Deck
  const myTasks = tasks.filter((t) => {
    if (!session) return false;
    const firstName = session.name.toLowerCase().split(' ')[0];
    return (
      (t.assigneeSlug && t.assigneeSlug === session.slug) ||
      (t.assignee && (t.assignee === session.name || t.assignee.toLowerCase().includes(firstName))) ||
      (session.slug && t.assigneeSlug?.includes(session.slug))
    );
  });
  const myPendingTasks = myTasks.filter((t) => t.status !== 'COMPLETED');
  const myCompletedTasks = myTasks.filter((t) => t.status === 'COMPLETED');

  const myLogs = logs.filter((l) => {
    if (!session) return false;
    const firstName = session.name.toLowerCase().split(' ')[0];
    return l.author === session.name || (l.author && l.author.toLowerCase().includes(firstName));
  });

  const myNotes = notes.filter((n) => {
    if (!session) return false;
    const firstName = session.name.toLowerCase().split(' ')[0];
    return n.author === session.name || (n.author && n.author.toLowerCase().includes(firstName));
  });

  // Rapid Broadcast Handler
  const handleQuickBroadcast = async (e) => {
    if (e) e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastSending(true);
    setBroadcastSuccess('');

    try {
      const res = await fetch('/api/portal/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastText.slice(0, 48) + (broadcastText.length > 48 ? '...' : ''),
          content: broadcastText,
          tag: broadcastTag,
          author: session.name,
          authorRole: session.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        setBroadcastSuccess('✓ Broadcast dispatched to all team members!');
        setBroadcastText('');
        loadNotes();
        loadAuditLogs();
        if (soundEnabled) playNotificationChime();
        setTimeout(() => setBroadcastSuccess(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBroadcastSending(false);
    }
  };

  // Copy Supervisor Consultation Agenda
  const handleCopySupervisorAgenda = () => {
    const activeTasksText = myTasks.length > 0 
      ? myTasks.map((t, idx) => `  ${idx + 1}. [${t.status}] ${t.title}`).join('\n')
      : '  1. Review architecture baseline & research methodology';
    
    const latestLogsText = logs.slice(0, 2).map((l) => `  - ${l.week}: ${l.title}`).join('\n');

    const agenda = `### 🎓 FYDP Supervisor Consultation Agenda\n**Date:** ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n**Team:** Team Random (UIU CSE)\n**Presenter / Communicator:** ${session.name} (${session.roleTitle})\n\n**1. Recent Progress & Milestones:**\n${latestLogsText || '  - Phase 1 Baseline in progress'}\n\n**2. Active Directives & Implementation:**\n${activeTasksText}\n\n**3. Discussion Points for Supervisor:**\n  - Dataset validation & benchmark evaluation metrics\n  - Architecture approval & next milestone timeline\n`;

    navigator.clipboard.writeText(agenda);
    setAgendaCopied(true);
    setTimeout(() => setAgendaCopied(false), 3000);
  };

  // Milestone countdown calculation
  const targetDate = new Date('2026-10-15T10:00:00');
  const now = new Date();
  const diffTime = targetDate - now;
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Dynamic velocity score
  const totalTasks = tasks.length || 1;
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const taskRatio = Math.round((completedTasksCount / totalTasks) * 50);
  const logScore = Math.min(30, logs.length * 10);
  const noteScore = Math.min(20, notes.length * 5);
  const velocityScore = Math.min(100, Math.max(45, taskRatio + logScore + noteScore));

  return (
    <main className="app-shell portal-screen">
      {/* Topbar */}
      <header className="topbar profile-topbar">
        <Link className="profile-back-btn" href="/" aria-label="Back to Homepage">
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <div className="portal-header-badge">
          <span>{session.name.split(' ')[0]}’s Workspace</span>
        </div>
        <div className="profile-top-actions">
          {/* Real-time Notification Bell */}
          <button
            className={`portal-notif-btn ${isNotifOpen ? 'active' : ''}`}
            onClick={() => setIsNotifOpen((prev) => !prev)}
            title="Notifications & Activity Stream"
            aria-label="Toggle notifications"
          >
            {unreadNotifCount > 0 ? (
              <>
                <BellRing size={16} />
                <span className="notif-ping-dot" />
                <span className="notif-badge-pill">{unreadNotifCount > 9 ? '9+' : unreadNotifCount}</span>
              </>
            ) : (
              <Bell size={16} />
            )}
          </button>

          <ThemeToggle />
          <button onClick={handleLogout} className="portal-logout-btn" title="Sign out">
            <LogOut size={15} />
            <span className="logout-text">Sign out</span>
          </button>
        </div>
      </header>

      {/* User Executive HUD Banner */}
      <section className="portal-hud-card">
        <div className="hud-ambient-glow" />
        <div className="hud-user-left">
          <div className="hud-avatar-container">
            <MemberAvatar
              member={isAdmin ? { name: 'System Administrator', initials: 'SA' } : (profileData || session)}
              size="md"
              className="hud-avatar"
            />
            <span className="hud-online-indicator" title="Active UIU Session" />
          </div>
          <div className="hud-user-details">
            <div className="hud-badge-row">
              {isAdmin ? (
                <span className="portal-role-badge admin">
                  <Crown size={13} />
                  Super Admin 👑
                </span>
              ) : (
                <span className="portal-role-badge member">
                  <UserRound size={13} />
                  Verified Member
                </span>
              )}
              <span className="hud-sub-id">ID: {session.username}</span>
              <span className="hud-uni-chip">UIU CSE</span>
            </div>
            <h2>{session.name}</h2>
            <p className="hud-role-line">
              <span className="hud-role-lead">{session.roleTitle}</span>
              {!isAdmin && <span className="hud-dept-sep">• FYDP Workspace Lead</span>}
            </p>
          </div>
        </div>

        <div className="hud-user-actions">
          {isAdmin ? (
            <Link href="/#team" className="soft-action compact-btn">
              <span>View Roster</span>
              <ArrowUpRight size={15} />
            </Link>
          ) : (
            <Link href={`/member/${session.slug}`} className="primary-action compact-btn" target="_blank">
              <span>View Live Portfolio</span>
              <ArrowUpRight size={15} />
            </Link>
          )}
        </div>
      </section>

      {/* Executive Personal Metrics Deck (4 Smart Cards) */}
      <section className="portal-metrics-deck" aria-label="Personal executive summary">
        <div
          className="portal-metric-card cursor-pointer"
          onClick={() => setActiveTab('tasks')}
          role="button"
          tabIndex={0}
        >
          <div className="metric-card-top">
            <div className="metric-icon-wrap icon-orange">
              <Target size={18} />
            </div>
            <span className={`metric-badge ${myPendingTasks.length > 0 ? 'orange' : 'neutral'}`}>
              {myPendingTasks.length > 0 ? `${myPendingTasks.length} Pending` : 'All Clear'}
            </span>
          </div>
          <div className="metric-card-body">
            <span className="metric-label">My Directives</span>
            <div className="metric-value-row">
              <strong>{myTasks.length}</strong>
              <small>{myCompletedTasks.length} Completed</small>
            </div>
          </div>
          <div className="metric-card-footer">
            <span>View assigned tasks</span>
            <ArrowRight size={13} />
          </div>
        </div>

        <div
          className="portal-metric-card cursor-pointer"
          onClick={() => setActiveTab(myLogs.length > 0 ? 'logs' : 'notes')}
          role="button"
          tabIndex={0}
        >
          <div className="metric-card-top">
            <div className="metric-icon-wrap icon-cyan">
              <Sparkles size={18} />
            </div>
            <span className="metric-badge cyan">
              {myLogs.length + myNotes.length} Items
            </span>
          </div>
          <div className="metric-card-body">
            <span className="metric-label">My Contributions</span>
            <div className="metric-value-row">
              <strong>{myLogs.length} Logs</strong>
              <small>• {myNotes.length} Notes</small>
            </div>
          </div>
          <div className="metric-card-footer">
            <span>Open workspace records</span>
            <ArrowRight size={13} />
          </div>
        </div>

        <div
          className="portal-metric-card cursor-pointer"
          onClick={() => setActiveTab('profile')}
          role="button"
          tabIndex={0}
        >
          <div className="metric-card-top">
            <div className="metric-icon-wrap icon-green">
              <CheckCircle2 size={18} />
            </div>
            <span className="metric-badge green">100% Ready</span>
          </div>
          <div className="metric-card-body">
            <span className="metric-label">Public Portfolio</span>
            <div className="metric-value-row">
              <strong>Live & Synced</strong>
              <small>Next.js / SSR</small>
            </div>
          </div>
          <div className="metric-card-footer">
            <span>Customize live portfolio</span>
            <ArrowRight size={13} />
          </div>
        </div>

        <div className="portal-metric-card">
          <div className="metric-card-top">
            <div className="metric-icon-wrap icon-purple">
              <ShieldCheck size={18} />
            </div>
            <span className="metric-badge active-live">
              <span className="live-dot" /> Online
            </span>
          </div>
          <div className="metric-card-body">
            <span className="metric-label">Access Clearance</span>
            <div className="metric-value-row">
              <strong style={{ fontSize: '14.5px' }}>{isAdmin ? 'Super Admin 👑' : (session.roleTitle || 'Team Member')}</strong>
            </div>
          </div>
          <div className="metric-card-footer">
            <span>UIU CSE FYDP Phase 1</span>
          </div>
        </div>
      </section>

      {/* Interactive Operations Console (4 Logical Functional Cards) */}
      <section className="portal-operations-grid" aria-label="Command operations console">
        {/* Logical Card 1: 🎯 Fast Directives Action Box (1-Tap Task Status Switcher) */}
        <div className="operation-card">
          <div className="operation-card-header">
            <div className="op-head-left">
              <div className="op-icon-pill orange">
                <Target size={15} />
              </div>
              <div>
                <h4>Fast Directives Hub</h4>
                <p>1-tap status updates for your assigned milestones</p>
              </div>
            </div>
            <span className="op-counter-tag orange">
              {myPendingTasks.length} Pending
            </span>
          </div>

          <div className="fast-tasks-list">
            {myTasks.length === 0 ? (
              <div className="op-empty-state">
                <CheckCircle2 size={22} className="text-emerald" />
                <p>No directives assigned to you right now.</p>
                <button
                  type="button"
                  className="soft-action compact-btn"
                  onClick={() => setActiveTab('tasks')}
                >
                  <Plus size={14} />
                  <span>Create New Directive</span>
                </button>
              </div>
            ) : (
              myTasks.slice(0, 3).map((task) => (
                <div key={task.id} className={`fast-task-item ${task.status === 'COMPLETED' ? 'completed' : ''}`}>
                  <div className="fast-task-info">
                    <div className="fast-task-title-row">
                      <span className={`priority-mini-dot ${task.priority?.toLowerCase() || 'high'}`} />
                      <strong>{task.title}</strong>
                    </div>
                    <span className="fast-task-due">Due: {task.dueDate || 'Sprint 4'}</span>
                  </div>
                  <div className="fast-task-actions">
                    {task.status !== 'COMPLETED' ? (
                      <>
                        {task.status === 'TODO' && (
                          <button
                            type="button"
                            className="fast-btn in-prog-btn"
                            onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                            title="Set In Progress"
                          >
                            <span>Start ➔</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="fast-btn done-btn"
                          onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                          title="Mark Done"
                        >
                          <Check size={13} />
                          <span>Done</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="fast-btn revert-btn"
                        onClick={() => handleUpdateTaskStatus(task.id, 'TODO')}
                        title="Reopen Directive"
                      >
                        <span>Reopen</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logical Card 2: 📢 Rapid Broadcast Dispatcher */}
        <div className="operation-card">
          <div className="operation-card-header">
            <div className="op-head-left">
              <div className="op-icon-pill cyan">
                <Radio size={15} />
              </div>
              <div>
                <h4>Team Rapid Broadcast</h4>
                <p>Dispatch instant memo & alert all members with audio</p>
              </div>
            </div>
            {broadcastSuccess && <span className="op-success-pill">{broadcastSuccess}</span>}
          </div>

          <form onSubmit={handleQuickBroadcast} className="rapid-broadcast-form">
            <div className="broadcast-input-wrap">
              <input
                type="text"
                placeholder="Type quick decision, agenda or announcement..."
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="broadcast-input"
              />
              <button
                type="submit"
                disabled={broadcastSending || !broadcastText.trim()}
                className="broadcast-send-btn"
              >
                {broadcastSending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>⚡ Broadcast</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </div>
            <div className="broadcast-tags-row">
              {['Meeting Note', 'Urgent Directive', 'Research Update', 'Architecture Decision'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`broadcast-tag-pill ${broadcastTag === tag ? 'active' : ''}`}
                  onClick={() => setBroadcastTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Logical Card 3: ⏱️ Next Supervisor Milestone & Countdown Clock */}
        <div className="operation-card">
          <div className="operation-card-header">
            <div className="op-head-left">
              <div className="op-icon-pill purple">
                <Clock size={15} />
              </div>
              <div>
                <h4>Supervisor Consultation Countdown</h4>
                <p>Phase 1 Methodology & Progress Milestone Review</p>
              </div>
            </div>
            <span className="op-counter-tag purple">Milestone 02</span>
          </div>

          <div className="milestone-countdown-box">
            <div className="countdown-number-block">
              <div className="countdown-digit">
                <strong>{diffDays}</strong>
                <span>Days</span>
              </div>
              <span className="countdown-colon">:</span>
              <div className="countdown-digit">
                <strong>14</strong>
                <span>Hours</span>
              </div>
              <span className="countdown-colon">:</span>
              <div className="countdown-digit">
                <strong>00</strong>
                <span>Mins</span>
              </div>
            </div>

            <div className="countdown-actions-row">
              <button
                type="button"
                className="soft-action op-tool-btn"
                onClick={handleCopySupervisorAgenda}
              >
                {agendaCopied ? <Check size={14} className="text-emerald" /> : <FileSpreadsheet size={14} />}
                <span>{agendaCopied ? 'Agenda Copied ✓' : 'Copy Supervisor Agenda'}</span>
              </button>

              <button
                type="button"
                className="primary-action op-tool-btn"
                onClick={() => setShowReportModal(true)}
              >
                <Printer size={14} />
                <span>Executive Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logical Card 4: 📊 Live Activity Velocity & Momentum Score */}
        <div className="operation-card">
          <div className="operation-card-header">
            <div className="op-head-left">
              <div className="op-icon-pill emerald">
                <Sparkles size={15} />
              </div>
              <div>
                <h4>Workspace Activity Velocity</h4>
                <p>Automated sprint health & contribution momentum</p>
              </div>
            </div>
            <span className="op-counter-tag green">{velocityScore}% Momentum</span>
          </div>

          <div className="velocity-card-body">
            <div className="velocity-progress-track">
              <div className="velocity-progress-bar" style={{ width: `${velocityScore}%` }} />
            </div>
            <div className="velocity-metrics-row">
              <div>
                <small>Tasks Completed</small>
                <strong>{completedTasksCount} / {totalTasks}</strong>
              </div>
              <div>
                <small>Sprint Logs</small>
                <strong>{logs.length} Published</strong>
              </div>
              <div>
                <small>Team Notes</small>
                <strong>{notes.length} Recorded</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segmented Control Navigation */}
      <nav className="portal-tab-bar" aria-label="Portal Tabs">
        <button
          className={`portal-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <UserRound size={16} />
          <span>Profile Editor</span>
        </button>

        <button
          className={`portal-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <ListTodo size={16} />
          <span>Directives & Tasks</span>
          {tasks.filter((t) => t.status === 'IN_PROGRESS').length > 0 && (
            <span className="tab-counter-badge">
              {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
            </span>
          )}
        </button>

        <button
          className={`portal-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <FileText size={16} />
          <span>Sprint Logs</span>
        </button>

        <button
          className={`portal-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <Layers size={16} />
          <span>Team Notes</span>
        </button>

        <button
          className={`portal-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('notifications');
            setIsNotifOpen(false);
          }}
        >
          <Radio size={16} />
          <span>Live Feed</span>
          {unreadNotifCount > 0 && (
            <span className="tab-counter-badge">
              {unreadNotifCount}
            </span>
          )}
        </button>

        <button
          className={`portal-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('security');
            setPwdTargetSlug(session.slug);
            setPwdMessage('');
          }}
        >
          <KeyRound size={16} />
          <span>Security</span>
        </button>

        {isAdmin && (
          <button
            className={`portal-tab-btn admin-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <Crown size={16} />
            <span>Admin Center</span>
          </button>
        )}
      </nav>

      {/* TAB 1: Profile Modular Section Editor */}
      {activeTab === 'profile' && profileData && (
        <section className="portal-content-box">
          {/* Admin Member Switcher Bar */}
          {isAdmin && allMembers.length > 0 && (
            <div className="admin-member-switch-bar">
              <div className="switch-bar-label">
                <Crown size={14} className="text-orange" />
                <span>EDITING RECORD FOR:</span>
              </div>
              <div className="member-pill-selector">
                {allMembers.map((m) => (
                  <button
                    key={m.slug}
                    type="button"
                    className={`member-select-pill ${selectedSlug === m.slug ? 'active' : ''}`}
                    onClick={() => handleMemberChange(m.slug)}
                  >
                    <MemberAvatar member={m} size="sm" />
                    <span>{m.name.split(' ')[0]}</span>
                    {selectedSlug === m.slug && <span className="pill-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="box-header-row">
            <div>
              <h3>Profile Information & Portfolio</h3>
              <p>Customize your public portfolio page. Updates appear instantly on your live profile.</p>
            </div>
            {profileMessage && (
              <div className={`portal-feedback ${profileMessage.startsWith('Error') ? 'error' : 'success'}`}>
                {profileMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="portal-form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileData.name || ''}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isAdmin}
                className={!isAdmin ? 'locked-input' : ''}
              />
              {!isAdmin && <span className="input-hint-lock">Academic Record Locked</span>}
            </div>

            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                value={profileData.id || ''}
                onChange={(e) => setProfileData({ ...profileData, id: e.target.value })}
                disabled={!isAdmin}
                className={!isAdmin ? 'locked-input' : ''}
              />
              {!isAdmin && <span className="input-hint-lock">Official Student ID Locked</span>}
            </div>

            <div className="form-group full-width">
              <label>Tagline / Motto</label>
              <input
                type="text"
                value={profileData.tagline || ''}
                onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                placeholder="e.g. Lead Architect & Full-Stack Engineer"
              />
            </div>

            <div className="form-group full-width">
              <label>About Me (Bio)</label>
              <textarea
                rows={3}
                value={profileData.about || ''}
                onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                placeholder="Describe your role, core focus, and technical contributions in FYDP..."
              />
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="text"
                value={profileData.phone || ''}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+880 1XXXXXXXXX"
              />
            </div>

            <div className="form-group">
              <label>Official Email</label>
              <input
                type="email"
                value={profileData.email || ''}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isAdmin}
                className={!isAdmin ? 'locked-input' : ''}
              />
            </div>

            <div className="form-group">
              <label>GitHub Profile URL</label>
              <input
                type="url"
                value={profileData.github || ''}
                onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn Profile URL</label>
              <input
                type="url"
                value={profileData.linkedin || ''}
                onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group full-width">
              <label>Technical Skills (Comma Separated)</label>
              <input
                type="text"
                value={Array.isArray(profileData.skills) ? profileData.skills.join(', ') : ''}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    skills: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  })
                }
                placeholder="React, Next.js, Node.js, PyTorch, Python"
              />
            </div>

            <div className="form-footer full-width">
              <button type="submit" className="primary-action" disabled={profileSaving}>
                <Save size={16} />
                <span>{profileSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 2: Supervisor Directives & Task Board (Kanban / Todo) */}
      {activeTab === 'tasks' && (
        <section className="portal-content-box">
          <div className="box-header-row">
            <div>
              <div className="card-header-badge">
                <ListTodo size={15} className="text-orange" />
                <span className="mini-label">SUPERVISOR DIRECTIVES & ACTION ITEMS</span>
              </div>
              <h3>Task Management & Kanban Board</h3>
              <p>Track tasks assigned from supervisor consultation meetings with real-time status updates.</p>
            </div>
            <div className="kanban-filter-row">
              <button
                type="button"
                className={`filter-pill ${taskFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setTaskFilter('ALL')}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${taskFilter === 'TODO' ? 'active' : ''}`}
                onClick={() => setTaskFilter('TODO')}
              >
                To Do ({tasks.filter((t) => t.status === 'TODO').length})
              </button>
              <button
                type="button"
                className={`filter-pill ${taskFilter === 'IN_PROGRESS' ? 'active' : ''}`}
                onClick={() => setTaskFilter('IN_PROGRESS')}
              >
                In Progress ({tasks.filter((t) => t.status === 'IN_PROGRESS').length})
              </button>
              <button
                type="button"
                className={`filter-pill ${taskFilter === 'DONE' ? 'active' : ''}`}
                onClick={() => setTaskFilter('DONE')}
              >
                Done ({tasks.filter((t) => t.status === 'DONE').length})
              </button>
            </div>
          </div>

          {taskMessage && (
            <div className={`portal-feedback ${taskMessage.startsWith('Error') ? 'error' : 'success'}`}>
              {taskMessage}
            </div>
          )}

          {/* New Task Directive Form */}
          <form onSubmit={handleCreateTask} className="portal-form-grid task-creation-box">
            <div className="form-group full-width">
              <label>Directive / Task Title</label>
              <input
                type="text"
                placeholder="e.g. Implement Confusion Matrix & ROC-AUC curves for baseline model"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Assign To Team Member</label>
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="member-dropdown"
              >
                {allMembers.map((m) => (
                  <option key={m.slug} value={m.name}>
                    {m.name} ({m.shortRole})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="member-dropdown"
              >
                <option value="HIGH">🔴 High Priority (Immediate)</option>
                <option value="MEDIUM">🟡 Medium Priority (Sprint Target)</option>
                <option value="LOW">🟢 Low Priority (Polish / Review)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Due Date</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Directive Description & Supervisor Notes</label>
              <textarea
                rows={2}
                placeholder="Detail the supervisor's exact requirements, dataset parameters, or architecture requirements..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
              />
            </div>

            <div className="form-footer full-width">
              <button type="submit" className="primary-action" disabled={taskPosting}>
                <Plus size={16} />
                <span>{taskPosting ? 'Creating...' : 'Assign Directive Task'}</span>
              </button>
            </div>
          </form>

          {/* Kanban Board Columns View */}
          <div className="kanban-board-grid">
            {/* Column 1: TODO */}
            <div className="kanban-column">
              <div className="kanban-col-head todo">
                <span>⏳ TO DO</span>
                <strong>{tasks.filter((t) => t.status === 'TODO').length}</strong>
              </div>
              <div className="kanban-card-stack">
                {tasks
                  .filter((t) => t.status === 'TODO')
                  .map((task) => (
                    <div key={task.id} className="kanban-task-card">
                      <div className="task-card-top">
                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        {(isAdmin || task.createdBy === session.name) && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="task-delete-btn"
                            title="Delete task"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <h5>{task.title}</h5>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta-row">
                        <div className="task-assignee">
                          <User size={12} />
                          <span>{task.assignee.split(' ')[0]}</span>
                        </div>
                        <div className="task-due">
                          <Calendar size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                      <div className="task-actions-row">
                        <button
                          type="button"
                          onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                          className="task-move-btn in-progress"
                        >
                          <span>Start Working ➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="kanban-column">
              <div className="kanban-col-head in-progress">
                <span>⚡ IN PROGRESS</span>
                <strong>{tasks.filter((t) => t.status === 'IN_PROGRESS').length}</strong>
              </div>
              <div className="kanban-card-stack">
                {tasks
                  .filter((t) => t.status === 'IN_PROGRESS')
                  .map((task) => (
                    <div key={task.id} className="kanban-task-card in-progress-card">
                      <div className="task-card-top">
                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        {(isAdmin || task.createdBy === session.name) && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="task-delete-btn"
                            title="Delete task"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <h5>{task.title}</h5>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta-row">
                        <div className="task-assignee">
                          <User size={12} />
                          <span>{task.assignee.split(' ')[0]}</span>
                        </div>
                        <div className="task-due">
                          <Calendar size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                      <div className="task-actions-row">
                        <button
                          type="button"
                          onClick={() => handleUpdateTaskStatus(task.id, 'DONE')}
                          className="task-move-btn done"
                        >
                          <span>Mark as Done ✓</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="kanban-column">
              <div className="kanban-col-head done">
                <span>✅ COMPLETED</span>
                <strong>{tasks.filter((t) => t.status === 'DONE').length}</strong>
              </div>
              <div className="kanban-card-stack">
                {tasks
                  .filter((t) => t.status === 'DONE')
                  .map((task) => (
                    <div key={task.id} className="kanban-task-card done-card">
                      <div className="task-card-top">
                        <span className="priority-tag done">COMPLETED</span>
                        {(isAdmin || task.createdBy === session.name) && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="task-delete-btn"
                            title="Delete task"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <h5>{task.title}</h5>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta-row">
                        <div className="task-assignee">
                          <User size={12} />
                          <span>{task.assignee.split(' ')[0]}</span>
                        </div>
                        <div className="task-due">
                          <CheckCircle2 size={12} className="text-emerald" />
                          <span>Done</span>
                        </div>
                      </div>
                      <div className="task-actions-row">
                        <button
                          type="button"
                          onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                          className="task-move-btn reopen"
                        >
                          <span>Reopen Task ↺</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: Weekly Sprint Logs */}
      {activeTab === 'logs' && (
        <section className="portal-content-box">
          <div className="box-header-row">
            <div>
              <h3>Weekly Sprint Timeline Logs</h3>
              <p>Official milestones and technical deliverables published directly to the homepage timeline.</p>
            </div>
            {logMessage && (
              <div className={`portal-feedback ${logMessage.startsWith('Error') ? 'error' : 'success'}`}>
                {logMessage}
              </div>
            )}
          </div>

          {isAdmin ? (
            <form onSubmit={handlePublishLog} className="portal-form-grid">
              <div className="form-group">
                <label>Week Identifier</label>
                <input
                  type="text"
                  value={newLogWeek}
                  onChange={(e) => setNewLogWeek(e.target.value)}
                  placeholder={`e.g. Week 0${logs.length + 1}`}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newLogCategory}
                  onChange={(e) => setNewLogCategory(e.target.value)}
                  className="member-dropdown"
                >
                  <option value="Engineering">Engineering Milestone</option>
                  <option value="Research">Research & Literature</option>
                  <option value="Supervisor Review">Supervisor Consultation</option>
                  <option value="Planning">Planning & Synopsis</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Log Title</label>
                <input
                  type="text"
                  value={newLogTitle}
                  onChange={(e) => setNewLogTitle(e.target.value)}
                  placeholder="e.g. Completed Baseline Benchmark & Dataset Preprocessing"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Highlights (One bullet point per line)</label>
                <textarea
                  rows={4}
                  value={newLogHighlights}
                  onChange={(e) => setNewLogHighlights(e.target.value)}
                  placeholder="Trained ResNet-50 baseline model&#10;Achieved 89.4% validation accuracy&#10;Created data augmentation scripts"
                  required
                />
              </div>

              <div className="form-footer full-width">
                <button type="submit" className="primary-action" disabled={logPosting}>
                  <Plus size={16} />
                  <span>Publish Sprint Log</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="security-admin-bypass-notice" style={{ margin: '14px 0' }}>
              <Shield size={16} className="text-orange" />
              <span>
                Homepage timeline sprint logs are official academic deliverables curated by the <strong>Technical Lead / Super Admin</strong>. Regular members can view all published logs below.
              </span>
            </div>
          )}

          <div className="logs-display-list">
            <h4>Live Timeline Logs Feed ({logs.length})</h4>
            <div className="timeline-feed-grid">
              {logs.map((log) => (
                <div key={log.id} className="log-card">
                  <div className="log-card-header">
                    <div className="log-week-badge">
                      <span className="log-category-pill">{log.category || 'Sprint'}</span>
                      <strong>{log.week}</strong>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLog(log.id)}
                        className="log-delete-btn"
                        title="Delete this sprint log"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <h3 className="log-title">{log.title}</h3>
                  <ul className="log-highlights">
                    {(Array.isArray(log.highlights) ? log.highlights : []).map((h, i) => (
                      <li key={i}>
                        <span className="bullet-dot" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: Internal Team Notes */}
      {activeTab === 'notes' && (
        <section className="portal-content-box">
          <div className="box-header-row">
            <div>
              <h3>Private Internal Team Notes</h3>
              <p>Secure workspace notes only visible to authenticated team members.</p>
            </div>
          </div>

          {noteMessage && (
            <div className={`portal-feedback ${noteMessage.startsWith('Error') || noteMessage.startsWith('Failed') ? 'error' : 'success'}`}>
              {noteMessage}
            </div>
          )}

          <form onSubmit={handlePostNote} className="portal-form-grid">
            <div className="form-group">
              <label>Note Title</label>
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="e.g. Meeting Agenda with Supervisor"
                required
              />
            </div>

            <div className="form-group">
              <label>Category Tag</label>
              <select
                value={newNoteTag}
                onChange={(e) => setNewNoteTag(e.target.value)}
                className="member-dropdown"
              >
                <option value="Meeting Note">Meeting Note</option>
                <option value="Announcement">Announcement</option>
                <option value="Research">Research Lead</option>
                <option value="Presentation">Presentation Rehearsal</option>
                <option value="Action Item">Action Item</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Content</label>
              <textarea
                rows={3}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write private team notes, action items, or supervisor feedback..."
                required
              />
            </div>

            <div className="form-footer full-width">
              <button type="submit" className="primary-action" disabled={notePosting}>
                <Send size={15} />
                <span>Post Team Note</span>
              </button>
            </div>
          </form>

          <div className="notes-display-list">
            <h4>Workspace Feed</h4>
            <div className="notes-feed-grid">
              {notes.map((note) => (
                <div key={note.id} className="team-note-card">
                  <div className="note-card-top">
                    <span className="log-category-pill">{note.tag}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="note-date">{note.date}</span>
                      {(isAdmin || note.author === session?.name) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="log-delete-btn"
                          title="Delete note"
                          style={{ padding: '2px 6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <h5>{note.title}</h5>
                  <p>{note.content}</p>
                  <div className="note-author-row">
                    <span>Posted by <strong>{note.author}</strong> ({note.authorRole})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: Security & Access / Password Manager */}
      {activeTab === 'security' && (
        <section className="portal-content-box">
          <div className="box-header-row">
            <div>
              <div className="card-header-badge">
                <KeyRound size={15} className="text-orange" />
                <span className="mini-label">SECURITY & ACCESS CONTROL</span>
              </div>
              <h3>Manage Account Password</h3>
              <p>
                {isAdmin
                  ? 'Update your confidential Super Admin password or reset any team member’s password.'
                  : 'Update your confidential workspace password. Passwords are encrypted on the server with HMAC-SHA256.'}
              </p>
            </div>
          </div>

          {pwdMessage && (
            <div className={`portal-feedback ${pwdMessageType === 'success' ? 'success' : 'error'}`}>
              {pwdMessage}
            </div>
          )}

          {/* Admin Member Target Switcher */}
          {isAdmin && allMembers.length > 0 && (
            <div className="admin-member-switch-bar">
              <div className="switch-bar-label">
                <Crown size={14} className="text-orange" />
                <span>TARGET ACCOUNT:</span>
              </div>
              <div className="member-pill-selector">
                <button
                  type="button"
                  className={`member-select-pill ${pwdTargetSlug === 'system-admin' ? 'active' : ''}`}
                  onClick={() => {
                    setPwdTargetSlug('system-admin');
                    setPwdMessage('');
                  }}
                >
                  <Crown size={13} className="text-orange" />
                  <span>Admin Password (You)</span>
                </button>
                {allMembers.map((m) => (
                  <button
                    key={m.slug}
                    type="button"
                    className={`member-select-pill ${pwdTargetSlug === m.slug ? 'active' : ''}`}
                    onClick={() => {
                      setPwdTargetSlug(m.slug);
                      setPwdMessage('');
                    }}
                  >
                    <MemberAvatar member={m} size="sm" />
                    <span>{m.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="portal-form-grid" style={{ maxWidth: 640 }}>
            {(!isAdmin || pwdTargetSlug === session.slug) && (
              <div className="form-group full-width">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={pwdOld}
                  onChange={(e) => setPwdOld(e.target.value)}
                  required
                />
              </div>
            )}

            {isAdmin && pwdTargetSlug !== session.slug && (
              <div className="form-group full-width">
                <div className="security-admin-bypass-notice">
                  <Shield size={16} className="text-orange" />
                  <span>
                    Super Admin override: Setting new password for{' '}
                    <strong>{allMembers.find((m) => m.slug === pwdTargetSlug)?.name || pwdTargetSlug}</strong> without
                    requiring their old password.
                  </span>
                </div>
              </div>
            )}

            <div className="form-group full-width">
              <label>New Password (min 6 characters)</label>
              <input
                type="password"
                placeholder="Enter new strong password"
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group full-width">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={pwdConfirm}
                onChange={(e) => setPwdConfirm(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-footer full-width">
              <button type="submit" className="primary-action" disabled={pwdSaving}>
                <KeyRound size={16} />
                <span>{pwdSaving ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>

          <div className="login-notice-box" style={{ marginTop: 24 }}>
            <span>🛡️ All passwords are salted & hashed server-side. Never exposed in inspect element.</span>
          </div>
        </section>
      )}

      {/* TAB 6: Super Admin Center & Activity Audit Logs */}
      {activeTab === 'admin' && isAdmin && (
        <section className="portal-content-box">
          <div className="box-header-row">
            <div>
              <div className="card-header-badge">
                <Crown size={15} className="text-orange" />
                <span className="mini-label">SUPER ADMIN CONTROLS & AUDIT</span>
              </div>
              <h3>Command Center & Security Audit</h3>
              <p>Administrative overview, live tamper-evident activity logs, and team permissions.</p>
            </div>
          </div>

          <div className="admin-grid-metrics">
            <div className="quick-card">
              <Users size={20} className="text-orange" />
              <div>
                <span>Registered Team</span>
                <strong>{allMembers.length} Members Active</strong>
              </div>
            </div>

            <div className="quick-card">
              <ListTodo size={20} className="text-orange" />
              <div>
                <span>Directive Tasks</span>
                <strong>{tasks.length} Total ({tasks.filter(t => t.status === 'DONE').length} Done)</strong>
              </div>
            </div>

            <div className="quick-card">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <span>Audit Logs</span>
                <strong>{auditLogs.length} Events Tracked</strong>
              </div>
            </div>
          </div>

          {/* Member Roster & Security Actions */}
          <div className="admin-roster-box">
            <h4>Member Permissions & Quick Controls</h4>
            <div className="admin-roster-list">
              {allMembers.map((m) => (
                <div key={m.slug} className="roster-item">
                  <div className="roster-left">
                    <MemberAvatar member={m} size="sm" />
                    <div className="roster-meta">
                      <strong>{m.name}</strong>
                      <span>
                        {m.id} • {m.role}
                      </span>
                    </div>
                  </div>
                  <div className="roster-right">
                    <span className="portal-role-badge member">Member</span>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        handleMemberChange(m.slug);
                      }}
                      className="soft-action"
                      style={{ minHeight: 32, padding: '0 12px', fontSize: 12 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('security');
                        setPwdTargetSlug(m.slug);
                        setPwdMessage('');
                      }}
                      className="soft-action"
                      style={{ minHeight: 32, padding: '0 12px', fontSize: 12, color: 'var(--brand-orange)' }}
                      title="Set / Reset Member Password"
                    >
                      <KeyRound size={12} />
                      <span>Password</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homepage Banner Media & Video Configuration */}
          <div className="admin-roster-box">
            <div className="box-header-row" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Video size={18} className="text-orange" />
                <h4 style={{ margin: 0 }}>Homepage Banner Media & Video Settings</h4>
              </div>
              {bannerMessage && (
                <div className={`portal-feedback ${bannerMessage.startsWith('Error') ? 'error' : 'success'}`}>
                  {bannerMessage}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveBannerConfig} className="portal-form-grid">
              <div className="form-group">
                <label>Default Banner Mode</label>
                <select
                  value={bannerConfig.mode}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, mode: e.target.value })}
                  className="member-dropdown"
                >
                  <option value="auto">Auto-Detect (Video with Photo Fallback)</option>
                  <option value="video">Force Video Mode</option>
                  <option value="image">Force Photo Mode</option>
                </select>
              </div>

              <div className="form-group">
                <label>Video Source File / Path</label>
                <input
                  type="text"
                  value={bannerConfig.videoUrl}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, videoUrl: e.target.value })}
                  placeholder="/team-banner.mp4 or public/..."
                />
              </div>

              <div className="form-group">
                <label>Poster / Fallback Image Path</label>
                <input
                  type="text"
                  value={bannerConfig.imageUrl}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, imageUrl: e.target.value })}
                  placeholder="/team-banner.jpg"
                />
              </div>

              <div className="form-group">
                <label>Banner Headline</label>
                <input
                  type="text"
                  value={bannerConfig.headline}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, headline: e.target.value })}
                  placeholder="Team Random"
                />
              </div>

              <div className="form-group full-width">
                <label>Banner Subtitle / Tagline</label>
                <input
                  type="text"
                  value={bannerConfig.tagline}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, tagline: e.target.value })}
                  placeholder="Engineering scalable software architecture & intelligent computing solutions."
                />
              </div>

              <div className="form-footer full-width">
                <button type="submit" className="primary-action" disabled={bannerSaving}>
                  <Save size={15} />
                  <span>{bannerSaving ? 'Saving...' : 'Save Banner Media Settings'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Admin Activity Audit Log Stream */}
          <div className="admin-audit-section">
            <div className="audit-section-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={18} className="text-orange" />
                <h4>Live Activity Audit Stream</h4>
              </div>
              <div className="audit-filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${auditFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('ALL')}
                >
                  All ({auditLogs.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${auditFilter === 'SECURITY' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('SECURITY')}
                >
                  Security
                </button>
                <button
                  type="button"
                  className={`filter-pill ${auditFilter === 'TASK' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('TASK')}
                >
                  Tasks
                </button>
                <button
                  type="button"
                  className={`filter-pill ${auditFilter === 'PROFILE' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('PROFILE')}
                >
                  Profile
                </button>
              </div>
            </div>

            <div className="audit-logs-stream">
              {filteredAuditLogs.length === 0 ? (
                <div className="audit-empty-state">
                  <span>No audit events recorded for this category yet.</span>
                </div>
              ) : (
                filteredAuditLogs.map((log) => (
                  <div key={log.id} className="audit-log-row">
                    <div className="audit-icon-box">
                      {log.type === 'SECURITY' ? (
                        <ShieldAlert size={15} className="text-orange" />
                      ) : log.type === 'TASK' ? (
                        <ListTodo size={15} className="text-emerald" />
                      ) : log.type === 'PROFILE' ? (
                        <UserCheck size={15} className="text-orange" />
                      ) : (
                        <FileText size={15} />
                      )}
                    </div>
                    <div className="audit-log-content">
                      <div className="audit-log-top">
                        <span className={`audit-type-tag ${log.type.toLowerCase()}`}>
                          {log.type}
                        </span>
                        <strong className="audit-actor">{log.actorName}</strong>
                        <span className="audit-action-tag">{log.action}</span>
                      </div>
                      <p className="audit-details">{log.details}</p>
                    </div>
                    <span className="audit-time">{log.formattedTime}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* TAB: Dedicated Notifications & Live Activity Hub */}
      {activeTab === 'notifications' && (
        <section className="portal-content-box notifications-full-screen-box">
          <div className="box-header-row">
            <div>
              <h3>Workspace Activity & Live Feed</h3>
              <p>Real-time stream of directives, team notes, sprint publications, and system security events.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="secondary-action compact-btn"
                onClick={toggleSound}
                title={soundEnabled ? 'Mute notification chime' : 'Enable notification chime'}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{soundEnabled ? 'Chime On' : 'Chime Off'}</span>
              </button>
              {unreadNotifCount > 0 && (
                <button
                  type="button"
                  className="primary-action compact-btn"
                  onClick={markAllNotifsAsRead}
                >
                  <CheckCheck size={14} />
                  <span>Mark All As Read</span>
                </button>
              )}
            </div>
          </div>

          <div className="notif-full-stats-bar">
            <div className="notif-stat-chip">
              <strong>{auditLogs.length}</strong>
              <span>Total Events</span>
            </div>
            <div className="notif-stat-chip unread">
              <strong>{unreadNotifCount}</strong>
              <span>Unread</span>
            </div>
            {forMeCount > 0 && (
              <div className="notif-stat-chip for-me">
                <strong>{forMeCount}</strong>
                <span>⚡ Directives For You</span>
              </div>
            )}
          </div>

          <div className="notif-category-filter" style={{ marginTop: 14 }}>
            <button
              className={`notif-filter-pill ${notifFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setNotifFilter('ALL')}
            >
              All ({auditLogs.length})
            </button>
            <button
              className={`notif-filter-pill ${notifFilter === 'UNREAD' ? 'active' : ''}`}
              onClick={() => setNotifFilter('UNREAD')}
            >
              Unread {unreadNotifCount > 0 && `(${unreadNotifCount})`}
            </button>
            {forMeCount > 0 && (
              <button
                className={`notif-filter-pill for-me ${notifFilter === 'FOR_ME' ? 'active' : ''}`}
                onClick={() => setNotifFilter('FOR_ME')}
              >
                ⚡ For You ({forMeCount})
              </button>
            )}
            <button
              className={`notif-filter-pill ${notifFilter === 'TASK' ? 'active' : ''}`}
              onClick={() => setNotifFilter('TASK')}
            >
              Tasks
            </button>
            <button
              className={`notif-filter-pill ${notifFilter === 'NOTE' ? 'active' : ''}`}
              onClick={() => setNotifFilter('NOTE')}
            >
              Team Notes
            </button>
            <button
              className={`notif-filter-pill ${notifFilter === 'TIMELINE' ? 'active' : ''}`}
              onClick={() => setNotifFilter('TIMELINE')}
            >
              Sprint Logs
            </button>
            <button
              className={`notif-filter-pill ${notifFilter === 'SECURITY' ? 'active' : ''}`}
              onClick={() => setNotifFilter('SECURITY')}
            >
              Security
            </button>
          </div>

          <div className="notif-full-page-list">
            {filteredNotifs.length === 0 ? (
              <div className="notif-empty-state" style={{ padding: '60px 20px' }}>
                <CheckCheck size={36} className="text-muted" />
                <p>No notifications in this category. You&apos;re all caught up!</p>
              </div>
            ) : (
              filteredNotifs.map((item) => {
                const isUnread = !readNotifIds.includes(item.id);
                const disp = getNotificationDisplayData(item);
                return (
                  <div
                    key={item.id}
                    className={`notif-item-card full-page-card ${isUnread ? 'unread' : 'read'} ${disp.isAssignedToMe ? 'assigned-me' : ''}`}
                    onClick={() => handleNotificationClick(item)}
                  >
                    <div className={`notif-item-icon ${item.type}`}>
                      {item.type === 'TASK' ? (
                        <ListTodo size={18} />
                      ) : item.type === 'NOTE' ? (
                        <Layers size={18} />
                      ) : item.type === 'TIMELINE' ? (
                        <FileText size={18} />
                      ) : item.type === 'SECURITY' ? (
                        <ShieldAlert size={18} />
                      ) : (
                        <UserRound size={18} />
                      )}
                    </div>

                    <div className="notif-item-body">
                      <div className="notif-item-meta">
                        <div className="notif-actor-badge-wrap">
                          <span className="notif-actor-name">{item.actorName}</span>
                          <span className="badge-micro" style={{ fontSize: '10px' }}>{item.type}</span>
                          {disp.actionBadge && (
                            <span className="notif-assigned-badge">{disp.actionBadge}</span>
                          )}
                        </div>
                        <span className="notif-time-ago">{formatRelativeTime(item.timestamp)}</span>
                      </div>

                      <div className="notif-item-headline">{disp.headline}</div>
                      <p className="notif-item-text">{item.details}</p>

                      <div className="notif-card-actions-row">
                        <span className="notif-quick-action-link">
                          {disp.quickAction} →
                        </span>
                        <button
                          type="button"
                          className={`notif-single-read-btn ${isUnread ? 'is-unread' : 'is-read'}`}
                          onClick={(e) => toggleMarkSingleRead(e, item.id)}
                          title={isUnread ? 'Mark as read' : 'Mark as unread'}
                          aria-label={isUnread ? 'Mark as read' : 'Mark as unread'}
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    </div>

                    {isUnread && <span className="notif-unread-dot" />}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Root-level Real-time Notification Popover & Bottom Sheet Drawer */}
      {isNotifOpen && (
        <div ref={notifPopoverRef}>
          <div
            className="portal-notif-backdrop"
            onClick={() => setIsNotifOpen(false)}
            aria-hidden="true"
          />

          <div className="portal-notif-popover">
            {/* Mobile Drag Handle */}
            <div className="notif-drag-handle" />

            <div className="notif-popover-header">
              <div className="notif-header-title">
                <Radio size={14} className="text-orange" />
                <span>Workspace Activity</span>
                {unreadNotifCount > 0 && (
                  <span className="badge-micro orange">{unreadNotifCount} new</span>
                )}
              </div>
              <div className="notif-header-actions">
                <button
                  className="notif-action-icon-btn"
                  onClick={toggleSound}
                  title={soundEnabled ? 'Mute notification chime' : 'Unmute notification chime'}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                {unreadNotifCount > 0 && (
                  <button className="notif-mark-read-btn" onClick={markAllNotifsAsRead}>
                    Mark all read
                  </button>
                )}
                <button
                  className="notif-action-icon-btn mobile-close-btn"
                  onClick={() => setIsNotifOpen(false)}
                  title="Close notifications"
                  aria-label="Close notifications"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="notif-category-filter">
              <button
                className={`notif-filter-pill ${notifFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setNotifFilter('ALL')}
              >
                All ({auditLogs.length})
              </button>
              <button
                className={`notif-filter-pill ${notifFilter === 'UNREAD' ? 'active' : ''}`}
                onClick={() => setNotifFilter('UNREAD')}
              >
                Unread {unreadNotifCount > 0 && `(${unreadNotifCount})`}
              </button>
              {forMeCount > 0 && (
                <button
                  className={`notif-filter-pill for-me ${notifFilter === 'FOR_ME' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('FOR_ME')}
                >
                  ⚡ For You ({forMeCount})
                </button>
              )}
              <button
                className={`notif-filter-pill ${notifFilter === 'TASK' ? 'active' : ''}`}
                onClick={() => setNotifFilter('TASK')}
              >
                Tasks
              </button>
              <button
                className={`notif-filter-pill ${notifFilter === 'NOTE' ? 'active' : ''}`}
                onClick={() => setNotifFilter('NOTE')}
              >
                Notes
              </button>
              <button
                className={`notif-filter-pill ${notifFilter === 'TIMELINE' ? 'active' : ''}`}
                onClick={() => setNotifFilter('TIMELINE')}
              >
                Logs
              </button>
            </div>

            {/* Notifications list */}
            <div className="notif-scroll-list">
              {filteredNotifs.length === 0 ? (
                <div className="notif-empty-state">
                  <CheckCheck size={28} className="text-muted" />
                  <p>You&apos;re all caught up! No notifications in this view.</p>
                </div>
              ) : (
                filteredNotifs.map((item) => {
                  const isUnread = !readNotifIds.includes(item.id);
                  const disp = getNotificationDisplayData(item);
                  return (
                    <div
                      key={item.id}
                      className={`notif-item-card ${isUnread ? 'unread' : 'read'} ${disp.isAssignedToMe ? 'assigned-me' : ''}`}
                      onClick={() => handleNotificationClick(item)}
                    >
                      <div className={`notif-item-icon ${item.type}`}>
                        {item.type === 'TASK' ? (
                          <ListTodo size={16} />
                        ) : item.type === 'NOTE' ? (
                          <Layers size={16} />
                        ) : item.type === 'TIMELINE' ? (
                          <FileText size={16} />
                        ) : item.type === 'SECURITY' ? (
                          <ShieldAlert size={16} />
                        ) : (
                          <UserRound size={16} />
                        )}
                      </div>

                      <div className="notif-item-body">
                        <div className="notif-item-meta">
                          <div className="notif-actor-badge-wrap">
                            <span className="notif-actor-name">{item.actorName}</span>
                            {disp.actionBadge && (
                              <span className="notif-assigned-badge">{disp.actionBadge}</span>
                            )}
                          </div>
                          <span className="notif-time-ago">{formatRelativeTime(item.timestamp)}</span>
                        </div>

                        <div className="notif-item-headline">{disp.headline}</div>
                        <p className="notif-item-text">{item.details}</p>

                        <div className="notif-card-actions-row">
                          <span className="notif-quick-action-link">
                            {disp.quickAction} →
                          </span>
                          <button
                            type="button"
                            className={`notif-single-read-btn ${isUnread ? 'is-unread' : 'is-read'}`}
                            onClick={(e) => toggleMarkSingleRead(e, item.id)}
                            title={isUnread ? 'Mark as read' : 'Mark as unread'}
                            aria-label={isUnread ? 'Mark as read' : 'Mark as unread'}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      </div>

                      {isUnread && <span className="notif-unread-dot" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary & Print Report Modal */}
      {showReportModal && (
        <div className="report-modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="report-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <div>
                <h2>Team Random • FYDP Phase 1 Workspace Summary</h2>
                <p>Department of Computer Science & Engineering • United International University</p>
              </div>
              <button className="modal-close" onClick={() => setShowReportModal(false)} aria-label="Close report"><X size={18} /></button>
            </div>

            <div className="report-modal-body">
              <div className="report-info-grid">
                <div><span>Project:</span><strong>Next-Gen FYDP Smart Workspace & System</strong></div>
                <div><span>Status:</span><strong>Phase 1 • In Progress (Velocity: {velocityScore}%)</strong></div>
                <div><span>Supervised By:</span><strong>Faculty Supervisor, Dept. of CSE, UIU</strong></div>
                <div><span>Generated By:</span><strong>{session.name} ({session.roleTitle})</strong></div>
              </div>

              <h4 style={{ margin: '18px 0 8px', fontSize: '14px', fontWeight: '800' }}>Active Directives Breakdown ({tasks.length})</h4>
              <div className="report-tasks-list">
                {tasks.map((t) => (
                  <div key={t.id} className="report-task-row">
                    <span className={`status-pill ${t.status?.toLowerCase()}`}>{t.status}</span>
                    <strong style={{ fontSize: '13px' }}>{t.title}</strong>
                    <small style={{ color: 'var(--muted)' }}>Assignee: {t.assignee}</small>
                  </div>
                ))}
              </div>

              <h4 style={{ margin: '18px 0 8px', fontSize: '14px', fontWeight: '800' }}>Recent Sprint Highlights ({logs.length})</h4>
              <div className="report-logs-list">
                {logs.slice(0, 3).map((l) => (
                  <div key={l.id} className="report-log-row">
                    <strong>{l.week} • {l.title}</strong>
                    <ul>
                      {l.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-modal-footer">
              <button className="soft-action" onClick={() => setShowReportModal(false)}>Close</button>
              <button className="primary-action" onClick={() => window.print()}>
                <Printer size={16} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Real-time Toast Notifications */}
      {toasts.length > 0 && (
        <div className="portal-toast-stack" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className="portal-toast-banner">
              <div className="toast-icon-wrapper">
                {toast.type === 'TASK' ? (
                  <ListTodo size={17} />
                ) : toast.type === 'NOTE' ? (
                  <Layers size={17} />
                ) : toast.type === 'TIMELINE' ? (
                  <FileText size={17} />
                ) : (
                  <ShieldAlert size={17} />
                )}
              </div>
              <div className="toast-content-wrapper">
                <div className="toast-header-row">
                  <span className="toast-tag-label">{toast.tagLabel}</span>
                  <span className="toast-time-label">Just now</span>
                </div>
                <strong className="toast-title-text">{toast.title}</strong>
                <p className="toast-body-text">{toast.message}</p>
                <button
                  className="toast-action-btn"
                  onClick={() => {
                    setActiveTab(toast.targetTab);
                    dismissToast(toast.id);
                  }}
                >
                  <span>View in workspace</span>
                  <ArrowRight size={12} />
                </button>
              </div>
              <button
                className="toast-close-btn"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
              <div className="toast-progress-track">
                <div className="toast-progress-bar" />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
