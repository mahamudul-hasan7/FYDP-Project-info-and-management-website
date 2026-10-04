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
  Camera,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Github,
  Globe,
  GraduationCap,
  History,
  Image as ImageIcon,
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
  RefreshCw,
  Save,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Share2,
  SlidersHorizontal,
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
import UniversalSaveOverlay from '../../components/UniversalSaveOverlay';

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
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);

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
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
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

  // Universal Save & Sync Loading Overlay state
  const [saveOverlay, setSaveOverlay] = useState({
    show: false,
    status: 'saving',
    title: 'Saving changes...',
    message: 'Synchronizing with workspace database...'
  });

  const triggerUniversalSave = (title = 'Saving changes...', message = 'Synchronizing with workspace database...') => {
    setSaveOverlay({ show: true, status: 'saving', title, message });
  };

  const resolveUniversalSaveSuccess = (title = 'Changes Saved Successfully ✓', message = 'All updates are now live on your portfolio.') => {
    setSaveOverlay({ show: true, status: 'success', title, message });
    if (soundEnabled) {
      playNotificationChime();
    }
    setTimeout(() => {
      setSaveOverlay((prev) => ({ ...prev, show: false }));
    }, 1150);
  };

  const resolveUniversalSaveError = (title = 'Failed to Save Changes', message = 'Please check your inputs and try again.') => {
    setSaveOverlay({ show: true, status: 'error', title, message });
    setTimeout(() => {
      setSaveOverlay((prev) => ({ ...prev, show: false }));
    }, 2200);
  };

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

  // Smart Live Sync for Team Notes, Tasks, Logs & Audit (Relaxed 25s polling + window focus refresh)
  useEffect(() => {
    if (!session) return;

    const refreshActiveData = () => {
      // Skip background network requests if tab is hidden/minimized
      if (typeof document !== 'undefined' && document.hidden) return;

      loadNotes();
      loadTasks();
      loadLogs();
      loadAuditLogs();
    };

    // 25-second relaxed heartbeat (avoids API spam and high serverless execution counts)
    const interval = setInterval(refreshActiveData, 25000);

    // Immediate sync when returning to the tab
    const handleFocus = () => refreshActiveData();

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
    triggerUniversalSave('Updating Banner Media...', 'Applying video & photo settings to homepage banner...');

    try {
      const res = await fetch('/api/portal/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerConfig)
      });
      const data = await res.json();
      if (data.success) {
        setBannerMessage('✓ Banner media settings updated successfully!');
        resolveUniversalSaveSuccess('Banner Settings Saved ✓', 'Homepage banner configurations updated.');
        loadAuditLogs();
        setTimeout(() => setBannerMessage(''), 3500);
      } else {
        setBannerMessage(`Error: ${data.message}`);
        resolveUniversalSaveError('Failed to Save Banner', data.message);
      }
    } catch (err) {
      setBannerMessage('Failed to save banner settings.');
      resolveUniversalSaveError('Connection Error', 'Failed to save banner settings.');
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

  // Add a technical skill to the active profile
  const handleAddSkill = (skillText) => {
    const text = (skillText || newSkillInput).trim();
    if (!text || !profileData) return;
    const current = Array.isArray(profileData.skills) ? profileData.skills : [];
    if (!current.includes(text)) {
      setProfileData({
        ...profileData,
        skills: [...current, text]
      });
    }
    setNewSkillInput('');
  };

  // Remove a skill from the active profile
  const handleRemoveSkill = (skillToRemove) => {
    if (!profileData || !Array.isArray(profileData.skills)) return;
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Copy live public profile link
  const handleCopyProfileLink = () => {
    if (!session?.slug) return;
    const url = typeof window !== 'undefined' ? `${window.location.origin}/member/${session.slug}` : '';
    if (navigator?.clipboard && url) {
      navigator.clipboard.writeText(url);
      setProfileLinkCopied(true);
      setTimeout(() => setProfileLinkCopied(false), 2500);
    }
  };

  // Copy logged-in user student ID
  const handleCopyMyId = () => {
    const idToCopy = session?.username || profileData?.id;
    if (idToCopy && navigator?.clipboard) {
      navigator.clipboard.writeText(idToCopy);
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    triggerUniversalSave('Saving Profile Changes...', 'Updating credentials and publishing to portfolio...');

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
        resolveUniversalSaveSuccess('Profile Saved Successfully ✓', 'All changes are now live on your portfolio.');
        setEditingSection(null);
        loadAuditLogs();
        setTimeout(() => setProfileMessage(''), 3500);
      } else {
        setProfileMessage(`Error: ${data.message}`);
        resolveUniversalSaveError('Error Saving Profile', data.message);
      }
    } catch (err) {
      setProfileMessage('Error saving profile.');
      resolveUniversalSaveError('Connection Error', 'Error saving profile.');
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
    triggerUniversalSave('Publishing Sprint Log...', 'Adding milestone deliverable to timeline...');

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
        resolveUniversalSaveSuccess('Sprint Log Published ✓', 'Milestone added to public timeline.');
        setNewLogTitle('');
        setNewLogWeek('');
        setNewLogHighlights('');
        loadLogs();
        loadAuditLogs();
        setTimeout(() => setLogMessage(''), 3500);
      } else {
        setLogMessage(`Error: ${data.message || 'Failed to post log.'}`);
        resolveUniversalSaveError('Failed to Publish Log', data.message || 'Server returned an error.');
      }
    } catch (err) {
      setLogMessage('Failed to post log.');
      resolveUniversalSaveError('Connection Error', 'Failed to publish sprint log.');
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
    triggerUniversalSave('Assigning Directive...', 'Adding directive task to Kanban board...');

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
        resolveUniversalSaveSuccess('Directive Task Assigned ✓', 'Task added to Kanban workflow.');
        setNewTaskTitle('');
        setNewTaskDesc('');
        loadTasks();
        loadAuditLogs();
        setTimeout(() => setTaskMessage(''), 3500);
      } else {
        setTaskMessage(`Error: ${data.message}`);
        resolveUniversalSaveError('Failed to Assign Directive', data.message || 'Server returned an error.');
      }
    } catch (err) {
      setTaskMessage('Failed to create task.');
      resolveUniversalSaveError('Connection Error', 'Failed to create directive task.');
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
    triggerUniversalSave('Posting Team Note...', 'Broadcasting private note to workspace...');

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
        resolveUniversalSaveSuccess('Team Note Published ✓', 'Visible to authenticated team members.');
        setNewNoteTitle('');
        setNewNoteContent('');
        loadNotes();
        loadAuditLogs();
        setTimeout(() => setNoteMessage(''), 3500);
      } else {
        setNoteMessage(`Error: ${data.message}`);
        resolveUniversalSaveError('Failed to Post Note', data.message || 'Server returned an error.');
      }
    } catch (err) {
      console.error('Failed to post note', err);
      setNoteMessage('Failed to post note.');
      resolveUniversalSaveError('Connection Error', 'Failed to post team note.');
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
    triggerUniversalSave('Securing Password...', 'Encrypting and updating workspace credentials...');

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
        resolveUniversalSaveSuccess('Password Updated ✓', 'New security password is now active.');
        setPwdOld('');
        setPwdNew('');
        setPwdConfirm('');
        loadAuditLogs();
        setTimeout(() => setPwdMessage(''), 4000);
      } else {
        setPwdMessage(`Error: ${data.message || 'Failed to update password.'}`);
        setPwdMessageType('error');
        resolveUniversalSaveError('Failed to Update Password', data.message || 'Verification failed.');
      }
    } catch (err) {
      setPwdMessage('Failed to update password. Please check connection.');
      setPwdMessageType('error');
      resolveUniversalSaveError('Connection Error', 'Failed to update credentials.');
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

  const isAdmin =
    session.role === 'ADMIN' ||
    session.slug === 'system-admin' ||
    session.username === 'admin';

  // Filtered tasks for Kanban board
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'ALL') return true;
    return t.status === taskFilter;
  });

  // Filtered audit logs with category and keyword search
  const filteredAuditLogs = auditLogs.filter((l) => {
    const matchesCategory = auditFilter === 'ALL' || l.type === auditFilter;
    if (!matchesCategory) return false;
    if (!auditSearchQuery.trim()) return true;
    const q = auditSearchQuery.toLowerCase().trim();
    return (
      (l.actorName && l.actorName.toLowerCase().includes(q)) ||
      (l.action && l.action.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q)) ||
      (l.type && l.type.toLowerCase().includes(q))
    );
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
        <div className="hud-ambient-glow-secondary" />
        <div className="hud-user-left">
          <div className="hud-avatar-container">
            <div className="hud-avatar-glow-ring">
              <MemberAvatar
                member={
                  session?.slug === 'system-admin' || session?.username === 'admin'
                    ? { slug: 'system-admin', name: 'System Administrator', role: 'ADMIN', adminAvatarStyle: profileData?.adminAvatarStyle || 'crown' }
                    : (profileData || session)
                }
                size="md"
                className="hud-avatar"
              />
            </div>
            <span className="hud-online-indicator" title="Active UIU Session">
              <span className="hud-online-pulse" />
            </span>
          </div>
          <div className="hud-user-details">
            <div className="hud-badge-row">
              {isAdmin ? (
                <span className="portal-role-badge admin">
                  <Crown size={12} />
                  Super Admin 👑
                </span>
              ) : (
                <span className="portal-role-badge member">
                  <Sparkles size={12} />
                  {session.roleTitle || 'Verified Member'}
                </span>
              )}

              <button
                type="button"
                onClick={handleCopyMyId}
                className={`hud-id-copy-pill ${idCopied ? 'copied' : ''}`}
                title="Click to copy Student ID"
              >
                <UserRound size={11} />
                <span>ID: {session.username}</span>
                {idCopied ? <Check size={11} className="text-emerald" /> : <Copy size={11} />}
              </button>

              <span className="hud-uni-chip">
                <GraduationCap size={11} />
                UIU CSE
              </span>
            </div>
            <h2>{session.name}</h2>
            <p className="hud-role-line">
              <span className="hud-role-lead">{session.roleTitle}</span>
              {!isAdmin && (
                <span className="hud-dept-sep">
                  • {profileData?.tagline ? `“${profileData.tagline}”` : 'FYDP Workspace Lead'}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="hud-user-actions">
          {isAdmin ? (
            <Link href="/#team" className="soft-action compact-btn">
              <Users size={14} />
              <span>Public Team Roster</span>
              <ArrowUpRight size={14} />
            </Link>
          ) : (
            <Link href={`/member/${session.slug}`} className="primary-action compact-btn" target="_blank">
              <Eye size={14} />
              <span>View Live Portfolio</span>
              <ArrowUpRight size={14} />
            </Link>
          )}
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
        <section className="portal-content-box profile-clean-box">
          {/* Admin Member Switcher Bar */}
          {isAdmin && allMembers.length > 0 && (
            <div className="admin-member-switch-bar">
              <div className="switch-bar-label">
                <Crown size={14} className="text-orange" />
                <span>SELECT MEMBER TO EDIT:</span>
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

          {profileMessage && (
            <div className={`portal-feedback ${profileMessage.startsWith('Error') ? 'error' : 'success'}`}>
              {profileMessage}
            </div>
          )}

          {/* Clean Form */}
          <form onSubmit={handleSaveProfile} className="clean-profile-form">
            {/* Section 1: Academic & Personal Info */}
            <div className="clean-form-section">
              <div className="clean-section-title">
                <UserRound size={16} className="text-orange" />
                <span>Academic & Personal Details</span>
              </div>

              <div className="clean-fields-grid">
                <div className="form-group">
                  <label>
                    <span>Full Name</span>
                    {!isAdmin && <span className="locked-pill"><Lock size={10} /> Verified Record</span>}
                  </label>
                  <input
                    type="text"
                    value={profileData.name || ''}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isAdmin}
                    className={!isAdmin ? 'locked-input' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span>Student ID</span>
                    {!isAdmin && <span className="locked-pill"><Lock size={10} /> Verified Record</span>}
                  </label>
                  <input
                    type="text"
                    value={profileData.id || ''}
                    onChange={(e) => setProfileData({ ...profileData, id: e.target.value })}
                    disabled={!isAdmin}
                    className={!isAdmin ? 'locked-input' : ''}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Professional Tagline / Motto</label>
                  <input
                    type="text"
                    value={profileData.tagline || ''}
                    onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                    placeholder="e.g. Lead Architect & Full-Stack Engineer"
                  />
                </div>

                <div className="form-group full-width">
                  <label>
                    <span>About Bio (Overview)</span>
                    <span className="char-count-hint">{(profileData.about || '').length} chars</span>
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.about || ''}
                    onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                    placeholder="Describe your role, core focus, and technical contributions in FYDP..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Social Handles */}
            <div className="clean-form-section contact-channels-section">
              <div className="clean-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={16} className="text-cyan" />
                  <span>Contact Channels & Profiles</span>
                </div>
                <span className="clean-count-badge" style={{ background: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.28)', color: '#06b6d4' }}>
                  Privacy & Links Hub
                </span>
              </div>

              <div className="clean-fields-grid">
                {/* Institutional Email */}
                <div className="form-group">
                  <div className="field-label-row">
                    <label>
                      <Mail size={13} className="text-muted" />
                      <span>Institutional Email</span>
                      {!isAdmin && <span className="locked-pill"><Lock size={10} /> Verified</span>}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileData({
                          ...profileData,
                          privacy: {
                            ...(profileData.privacy || {}),
                            email: profileData.privacy?.email === false ? true : false
                          }
                        })
                      }
                      className={`privacy-toggle-btn ${profileData.privacy?.email !== false ? 'public' : 'hidden'}`}
                      title={profileData.privacy?.email !== false ? 'Public: Visible on portfolio (Click to Hide)' : 'Hidden: Hidden from public (Click to Show)'}
                    >
                      {profileData.privacy?.email !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{profileData.privacy?.email !== false ? 'Public' : 'Hidden'}</span>
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <Mail size={14} className="input-prefix-icon" />
                    <input
                      type="email"
                      value={profileData.email || ''}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isAdmin}
                      className={!isAdmin ? 'locked-input' : ''}
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="form-group">
                  <div className="field-label-row">
                    <label>
                      <Phone size={13} className="text-muted" />
                      <span>Contact Phone</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileData({
                          ...profileData,
                          privacy: {
                            ...(profileData.privacy || {}),
                            phone: profileData.privacy?.phone === false ? true : false
                          }
                        })
                      }
                      className={`privacy-toggle-btn ${profileData.privacy?.phone !== false ? 'public' : 'hidden'}`}
                      title={profileData.privacy?.phone !== false ? 'Public: Click-to-call active (Click to Hide)' : 'Hidden: Private from visitors (Click to Show)'}
                    >
                      {profileData.privacy?.phone !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{profileData.privacy?.phone !== false ? 'Public' : 'Hidden'}</span>
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <Phone size={14} className="input-prefix-icon" />
                    <input
                      type="text"
                      value={profileData.phone || ''}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+880 1XXXXXXXXX"
                    />
                  </div>
                </div>

                {/* GitHub Profile URL */}
                <div className="form-group">
                  <div className="field-label-row">
                    <label>
                      <Github size={13} className="text-muted" />
                      <span>GitHub Profile URL</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileData({
                          ...profileData,
                          privacy: {
                            ...(profileData.privacy || {}),
                            github: profileData.privacy?.github === false ? true : false
                          }
                        })
                      }
                      className={`privacy-toggle-btn ${profileData.privacy?.github !== false ? 'public' : 'hidden'}`}
                      title={profileData.privacy?.github !== false ? 'Public: Visible on portfolio (Click to Hide)' : 'Hidden: Hidden from public (Click to Show)'}
                    >
                      {profileData.privacy?.github !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{profileData.privacy?.github !== false ? 'Public' : 'Hidden'}</span>
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <Github size={14} className="input-prefix-icon" />
                    <input
                      type="url"
                      value={profileData.github || ''}
                      onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                {/* LinkedIn Profile URL */}
                <div className="form-group">
                  <div className="field-label-row">
                    <label>
                      <Linkedin size={13} className="text-muted" />
                      <span>LinkedIn Profile URL</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileData({
                          ...profileData,
                          privacy: {
                            ...(profileData.privacy || {}),
                            linkedin: profileData.privacy?.linkedin === false ? true : false
                          }
                        })
                      }
                      className={`privacy-toggle-btn ${profileData.privacy?.linkedin !== false ? 'public' : 'hidden'}`}
                      title={profileData.privacy?.linkedin !== false ? 'Public: Visible on portfolio (Click to Hide)' : 'Hidden: Hidden from public (Click to Show)'}
                    >
                      {profileData.privacy?.linkedin !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{profileData.privacy?.linkedin !== false ? 'Public' : 'Hidden'}</span>
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <Linkedin size={14} className="input-prefix-icon" />
                    <input
                      type="url"
                      value={profileData.linkedin || ''}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Custom Links & Websites Sub-block */}
              <div className="custom-links-subblock">
                <div className="custom-links-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Globe size={15} className="text-orange" />
                    <strong style={{ fontSize: 13, color: 'var(--text)' }}>Additional Websites & Custom Links</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentList = Array.isArray(profileData.customLinks) ? [...profileData.customLinks] : [];
                      setProfileData({
                        ...profileData,
                        customLinks: [
                          ...currentList,
                          { id: Date.now(), title: '', url: '', isPublic: true }
                        ]
                      });
                    }}
                    className="soft-action clean-add-link-btn"
                  >
                    <Plus size={13} />
                    <span>Add Custom Link</span>
                  </button>
                </div>

                {/* List of Custom Links */}
                {Array.isArray(profileData.customLinks) && profileData.customLinks.length > 0 ? (
                  <div className="custom-links-list">
                    {profileData.customLinks.map((link, idx) => (
                      <div key={link.id || idx} className="custom-link-row">
                        <div className="custom-link-title-wrap">
                          <input
                            type="text"
                            placeholder="Platform / Title (e.g. Portfolio, Google Scholar)"
                            value={link.title || ''}
                            onChange={(e) => {
                              const updated = [...profileData.customLinks];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setProfileData({ ...profileData, customLinks: updated });
                            }}
                            className="custom-link-input-title"
                          />
                        </div>
                        <div className="input-with-icon custom-link-url-wrap">
                          <ExternalLink size={13} className="input-prefix-icon" />
                          <input
                            type="url"
                            placeholder="https://..."
                            value={link.url || ''}
                            onChange={(e) => {
                              const updated = [...profileData.customLinks];
                              updated[idx] = { ...updated[idx], url: e.target.value };
                              setProfileData({ ...profileData, customLinks: updated });
                            }}
                            className="custom-link-input-url"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...profileData.customLinks];
                            updated[idx] = { ...updated[idx], isPublic: link.isPublic === false ? true : false };
                            setProfileData({ ...profileData, customLinks: updated });
                          }}
                          className={`privacy-toggle-btn ${link.isPublic !== false ? 'public' : 'hidden'}`}
                          title={link.isPublic !== false ? 'Public (Click to Hide)' : 'Hidden (Click to Show)'}
                        >
                          {link.isPublic !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                          <span>{link.isPublic !== false ? 'Public' : 'Hidden'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = profileData.customLinks.filter((_, i) => i !== idx);
                            setProfileData({ ...profileData, customLinks: updated });
                          }}
                          className="custom-link-del-btn"
                          title="Delete Link"
                          aria-label="Delete Link"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-custom-links-note">
                    <Share2 size={14} className="text-muted" />
                    <span>No custom links added yet. Click &ldquo;Add Custom Link&rdquo; or pick a preset below.</span>
                  </div>
                )}

                {/* Popular Platform Quick Presets */}
                <div className="custom-link-presets">
                  <span className="clean-sugg-label">Popular Presets:</span>
                  {[
                    { title: 'Portfolio Website', urlPrefix: 'https://' },
                    { title: 'Google Scholar', urlPrefix: 'https://scholar.google.com/citations?user=' },
                    { title: 'ResearchGate', urlPrefix: 'https://www.researchgate.net/profile/' },
                    { title: 'Twitter / X', urlPrefix: 'https://x.com/' },
                    { title: 'Kaggle', urlPrefix: 'https://www.kaggle.com/' },
                    { title: 'Medium', urlPrefix: 'https://medium.com/@' }
                  ]
                    .filter((p) => !profileData.customLinks?.some((l) => l.title?.toLowerCase() === p.title.toLowerCase()))
                    .map((preset) => (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => {
                          const currentList = Array.isArray(profileData.customLinks) ? [...profileData.customLinks] : [];
                          setProfileData({
                            ...profileData,
                            customLinks: [
                              ...currentList,
                              { id: Date.now(), title: preset.title, url: preset.urlPrefix, isPublic: true }
                            ]
                          });
                        }}
                        className="clean-sugg-pill"
                        title={`Add ${preset.title}`}
                      >
                        <Plus size={10} className="sugg-plus" />
                        <span>{preset.title}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Section 3: Technical Skills Cloud */}
            <div className="clean-form-section skills-expert-section">
              <div className="clean-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Code2 size={16} className="text-orange" />
                  <span>Technical Skills & Expertise</span>
                </div>
                <span className="clean-count-badge">
                  {Array.isArray(profileData.skills) ? profileData.skills.length : 0} Added
                </span>
              </div>

              <div className="clean-skills-box">
                {/* Active Skill Pills */}
                <div className="clean-skills-flow">
                  {Array.isArray(profileData.skills) && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill) => (
                      <span key={skill} className="clean-skill-tag" title={skill}>
                        <span className="skill-dot" />
                        <span className="skill-name">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="clean-skill-del"
                          title={`Remove ${skill}`}
                          aria-label={`Remove ${skill}`}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <div className="empty-skills-hint">
                      <Tag size={13} className="text-muted" />
                      <span>No technical skills added yet. Type below or pick from quick suggestions.</span>
                    </div>
                  )}
                </div>

                {/* Add Skill Row */}
                <div className="clean-skill-input-row">
                  <div className="input-with-icon skill-input-wrap">
                    <Tag size={14} className="input-prefix-icon" />
                    <input
                      type="text"
                      placeholder="Type a skill or tool (e.g. Next.js, PyTorch, Docker, PostgreSQL)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="clean-skill-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    disabled={!newSkillInput.trim()}
                    className="primary-action clean-add-btn"
                  >
                    <Plus size={14} />
                    <span>Add Skill</span>
                  </button>
                </div>

                {/* Suggestions */}
                <div className="clean-suggestions-row">
                  <div className="clean-sugg-header">
                    <Sparkles size={12} className="text-orange" />
                    <span className="clean-sugg-label">Quick Suggestions:</span>
                  </div>
                  <div className="clean-sugg-chips">
                    {[
                      'Next.js',
                      'React',
                      'Node.js',
                      'Python',
                      'PyTorch',
                      'FastAPI',
                      'PostgreSQL',
                      'MongoDB',
                      'Docker',
                      'Tailwind CSS',
                      'TypeScript',
                      'UI/UX Design',
                      'System Architecture',
                      'Research & Analysis'
                    ]
                      .filter((s) => !profileData.skills?.includes(s))
                      .slice(0, 8)
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddSkill(suggestion)}
                          className="clean-sugg-pill"
                          title={`Add ${suggestion}`}
                        >
                          <Plus size={10} className="sugg-plus" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Save Footer */}
            <div className="clean-save-bar">
              <span className="clean-save-note">All updates reflect immediately on your live portfolio.</span>
              <button type="submit" className="primary-action clean-save-btn" disabled={profileSaving}>
                <Save size={15} />
                <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
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

          {/* New Task Directive Form (Only Super Admin / Lead can assign directives) */}
          {isAdmin ? (
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
          ) : (
            <div className="role-security-badge" style={{ marginBottom: '18px', padding: '12px 16px', borderRadius: '12px', background: 'var(--card-bg, rgba(255,255,255,0.04))', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} className="text-orange" />
              <span style={{ fontSize: '13px', opacity: 0.9 }}>
                <strong>Supervisor Directives Board:</strong> Directives are managed by Project Admin / Technical Lead. You can update progress on tasks assigned to you.
              </span>
            </div>
          )}

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
                  .map((task) => {
                    const isMyTask =
                      (task.assigneeSlug && String(task.assigneeSlug).toLowerCase() === String(session?.slug || '').toLowerCase()) ||
                      (task.assignee && String(task.assignee).toLowerCase() === String(session?.name || '').toLowerCase());
                    const canMove = isAdmin || isMyTask;

                    return (
                      <div key={task.id} className="kanban-task-card">
                        <div className="task-card-top">
                          <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                          {isAdmin && (
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
                            <span>{task.assignee.split(' ')[0]} {isMyTask ? '(You)' : ''}</span>
                          </div>
                          <div className="task-due">
                            <Calendar size={12} />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                        <div className="task-actions-row">
                          {canMove ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                              className="task-move-btn in-progress"
                            >
                              <span>Start Working ➔</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Lock size={10} /> Read only
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  .map((task) => {
                    const isMyTask =
                      (task.assigneeSlug && String(task.assigneeSlug).toLowerCase() === String(session?.slug || '').toLowerCase()) ||
                      (task.assignee && String(task.assignee).toLowerCase() === String(session?.name || '').toLowerCase());
                    const canMove = isAdmin || isMyTask;

                    return (
                      <div key={task.id} className="kanban-task-card in-progress-card">
                        <div className="task-card-top">
                          <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                          {isAdmin && (
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
                            <span>{task.assignee.split(' ')[0]} {isMyTask ? '(You)' : ''}</span>
                          </div>
                          <div className="task-due">
                            <Calendar size={12} />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                        <div className="task-actions-row">
                          {canMove ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateTaskStatus(task.id, 'DONE')}
                              className="task-move-btn done"
                            >
                              <span>Mark as Done ✓</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Lock size={10} /> Read only
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  .map((task) => {
                    const isMyTask =
                      (task.assigneeSlug && String(task.assigneeSlug).toLowerCase() === String(session?.slug || '').toLowerCase()) ||
                      (task.assignee && String(task.assignee).toLowerCase() === String(session?.name || '').toLowerCase());
                    const canMove = isAdmin || isMyTask;

                    return (
                      <div key={task.id} className="kanban-task-card done-card">
                        <div className="task-card-top">
                          <span className="priority-tag done">COMPLETED</span>
                          {isAdmin && (
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
                            <span>{task.assignee.split(' ')[0]} {isMyTask ? '(You)' : ''}</span>
                          </div>
                          <div className="task-due">
                            <CheckCircle2 size={12} className="text-emerald" />
                            <span>Done</span>
                          </div>
                        </div>
                        <div className="task-actions-row">
                          {canMove ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                              className="task-move-btn reopen"
                            >
                              <span>Reopen Task ↺</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Lock size={10} /> Read only
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

          {/* Admin Metrics Grid */}
          <div className="admin-grid-metrics">
            {/* Card 1: Registered Team */}
            <div className="admin-kpi-card kpi-orange">
              <div className="kpi-top">
                <span className="kpi-label">Registered Team</span>
                <div className="kpi-icon-wrap">
                  <Users size={18} />
                </div>
              </div>
              <div className="kpi-body">
                <div className="kpi-value-row">
                  <span className="kpi-number">{allMembers.length}</span>
                  <span className="kpi-unit">Members</span>
                </div>
                <div className="kpi-subtext">Active FYDP Accounts</div>
              </div>
              <div className="kpi-footer">
                <span className="kpi-badge kpi-badge-green">● 100% Configured</span>
              </div>
            </div>

            {/* Card 2: Directive Tasks */}
            <div className="admin-kpi-card kpi-amber">
              <div className="kpi-top">
                <span className="kpi-label">Supervisor Tasks</span>
                <div className="kpi-icon-wrap">
                  <ListTodo size={18} />
                </div>
              </div>
              <div className="kpi-body">
                <div className="kpi-value-row">
                  <span className="kpi-number">
                    {tasks.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED').length}
                    <span className="kpi-fraction">/{tasks.length}</span>
                  </span>
                  <span className="kpi-unit">Done</span>
                </div>
                <div className="kpi-subtext">Sprint Action Items</div>
              </div>
              <div className="kpi-footer">
                <div className="kpi-progress-bar">
                  <div
                    className="kpi-progress-fill"
                    style={{
                      width: `${tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED').length / tasks.length) * 100) : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Sprint Deliverables */}
            <div className="admin-kpi-card kpi-cyan">
              <div className="kpi-top">
                <span className="kpi-label">Sprint Logs</span>
                <div className="kpi-icon-wrap">
                  <FileText size={18} />
                </div>
              </div>
              <div className="kpi-body">
                <div className="kpi-value-row">
                  <span className="kpi-number">{logs.length}</span>
                  <span className="kpi-unit">Milestones</span>
                </div>
                <div className="kpi-subtext">Published Weekly Logs</div>
              </div>
              <div className="kpi-footer">
                <span className="kpi-badge kpi-badge-cyan">Deliverables Tracked</span>
              </div>
            </div>

            {/* Card 4: Audit Logs */}
            <div className="admin-kpi-card kpi-emerald">
              <div className="kpi-top">
                <span className="kpi-label">Security & Audit</span>
                <div className="kpi-icon-wrap">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <div className="kpi-body">
                <div className="kpi-value-row">
                  <span className="kpi-number">{auditLogs.length}</span>
                  <span className="kpi-unit">Events</span>
                </div>
                <div className="kpi-subtext">Tamper-Evident Logs</div>
              </div>
              <div className="kpi-footer">
                <span className="kpi-badge kpi-badge-emerald">● Realtime Sync</span>
              </div>
            </div>
          </div>

          {/* Member Roster & Permissions Management */}
          <div className="admin-roster-box">
            <div className="box-header-row" style={{ marginBottom: 12, paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={17} className="text-orange" />
                <h4 style={{ margin: 0 }}>Team Member Permissions & Quick Controls</h4>
              </div>
              <span className="clean-sugg-label" style={{ fontSize: 11 }}>
                Total: {allMembers.length} Accounts
              </span>
            </div>

            <div className="admin-roster-list">
              {allMembers.map((m) => {
                const isMemberAdmin = m.slug === 'system-admin' || m.username === 'admin' || m.role === 'ADMIN';
                return (
                  <div key={m.slug} className="roster-item">
                    <div className="roster-left">
                      <MemberAvatar member={m} size="sm" />
                      <div className="roster-meta">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <strong>{m.name}</strong>
                          {isMemberAdmin ? (
                            <span className="portal-role-badge admin">
                              <Crown size={10} /> Super Admin
                            </span>
                          ) : (
                            <span className="portal-role-badge member">{m.shortRole || 'Member'}</span>
                          )}
                        </div>
                        <span>
                          {m.id} • {m.email || `${m.slug}@uiu.ac.bd`}
                        </span>
                      </div>
                    </div>
                    <div className="roster-right">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('profile');
                          handleMemberChange(m.slug);
                        }}
                        className="soft-action"
                        style={{ minHeight: 32, padding: '0 12px', fontSize: 12 }}
                      >
                        <Pencil size={12} />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        type="button"
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
                        <span>Reset Password</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Homepage Banner Media & Video Configuration with Live Preview */}
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

            {/* Visual Live Preview Frame */}
            <div className="admin-media-preview-container">
              <div className="admin-media-preview-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={14} className="text-orange" />
                  <span>LIVE HOMEPAGE BANNER PREVIEW</span>
                </div>
                <span className="preview-mode-tag">
                  Mode: {bannerConfig.mode.toUpperCase()}
                </span>
              </div>

              <div className="admin-media-preview-frame">
                {bannerConfig.mode !== 'image' && bannerConfig.videoUrl ? (
                  <video
                    src={bannerConfig.videoUrl}
                    poster={bannerConfig.imageUrl || '/team-banner.jpg'}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="admin-preview-video"
                  />
                ) : (
                  <img
                    src={bannerConfig.imageUrl || '/team-banner.jpg'}
                    alt="Banner Preview"
                    className="admin-preview-image"
                  />
                )}
                <div className="admin-preview-overlay">
                  <span className="admin-preview-badge">UIU CSE • FYDP 2026</span>
                  <h5>{bannerConfig.headline || 'Team Random'}</h5>
                  <p>{bannerConfig.tagline || 'Engineering scalable software architecture & intelligent computing solutions.'}</p>
                </div>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="admin-presets-row">
              <span className="clean-sugg-label">Presets:</span>
              <button
                type="button"
                className="clean-sugg-pill"
                onClick={() => setBannerConfig({ ...bannerConfig, videoUrl: '/team-banner.mp4' })}
              >
                + Video: /team-banner.mp4
              </button>
              <button
                type="button"
                className="clean-sugg-pill"
                onClick={() => setBannerConfig({ ...bannerConfig, imageUrl: '/team-banner.jpg' })}
              >
                + Image: /team-banner.jpg
              </button>
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

          {/* Admin Activity Audit Log Stream with Search & Category Filters */}
          <div className="admin-audit-section">
            <div className="audit-section-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={18} className="text-orange" />
                <h4 style={{ margin: 0 }}>Live Activity Audit Stream</h4>
                <span className="audit-count-pill">{filteredAuditLogs.length} Events</span>
              </div>

              {/* Search Bar */}
              <div className="audit-search-box">
                <Search size={14} className="audit-search-icon" />
                <input
                  type="text"
                  placeholder="Search logs by actor, action or detail..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="audit-search-input"
                />
                {auditSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setAuditSearchQuery('')}
                    className="audit-search-clear"
                    title="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="audit-filter-pills" style={{ marginTop: 8 }}>
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
              <button
                type="button"
                className={`filter-pill ${auditFilter === 'NOTE' ? 'active' : ''}`}
                onClick={() => setAuditFilter('NOTE')}
              >
                Notes
              </button>
              <button
                type="button"
                className={`filter-pill ${auditFilter === 'TIMELINE' ? 'active' : ''}`}
                onClick={() => setAuditFilter('TIMELINE')}
              >
                Timeline
              </button>
            </div>

            <div className="audit-logs-stream">
              {filteredAuditLogs.length === 0 ? (
                <div className="audit-empty-state">
                  <CheckCheck size={28} className="text-muted" />
                  <span>No audit events match your search or filter criteria.</span>
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
                        <UserCheck size={15} className="text-purple" />
                      ) : log.type === 'NOTE' ? (
                        <Layers size={15} className="text-amber" />
                      ) : log.type === 'TIMELINE' ? (
                        <FileText size={15} className="text-cyan" />
                      ) : (
                        <FileText size={15} />
                      )}
                    </div>
                    <div className="audit-log-content">
                      <div className="audit-log-top">
                        <span className={`audit-type-tag ${log.type?.toLowerCase() || 'general'}`}>
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
                <div><span>Project:</span><strong>FYDP Project (Topic & Title Pending)</strong></div>
                <div><span>Status:</span><strong>Phase 1 • Topic Pending (Velocity: {velocityScore}%)</strong></div>
                <div><span>Supervised By:</span><strong>Faculty Supervisor (TBA), Dept. of CSE, UIU</strong></div>
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

      {/* Universal Save / Sync Animation Overlay */}
      <UniversalSaveOverlay
        show={saveOverlay.show}
        status={saveOverlay.status}
        title={saveOverlay.title}
        message={saveOverlay.message}
      />
    </main>
  );
}
