import { NextResponse } from 'next/server';
import { getAllLogs, getAllTasks, getAllAuditLogs } from '../../../../lib/store';

export async function GET() {
  try {
    const logs = getAllLogs() || [];
    const tasks = getAllTasks() || [];
    const auditLogs = getAllAuditLogs() || [];

    // STRICT LIMITATION: Whitelist only official milestone events
    // Filter out: internal task deletions, note updates, password changes, private admin overrides
    const ALLOWED_ACTIONS = ['TIMELINE_POSTED', 'TASK_STATUS_CHANGE', 'TASK_CREATED'];

    const publicStream = auditLogs
      .filter((l) => ALLOWED_ACTIONS.includes(l.action))
      .slice(0, 5) // Strict limit to top 5 milestone actions
      .map((l) => {
        let cleanAction = 'MILESTONE';
        let badgeType = 'default';

        if (l.action === 'TIMELINE_POSTED') {
          cleanAction = 'SPRINT PUBLISHED';
          badgeType = 'sprint';
        } else if (l.action === 'TASK_STATUS_CHANGE') {
          if (l.details.includes('DONE')) {
            cleanAction = 'TASK COMPLETED';
            badgeType = 'completed';
          } else {
            cleanAction = 'IN PROGRESS';
            badgeType = 'in_progress';
          }
        } else if (l.action === 'TASK_CREATED') {
          cleanAction = 'NEW DIRECTIVE';
          badgeType = 'directive';
        }

        return {
          id: l.id,
          actorName: l.actorName || 'Team Member',
          actorRole: l.actorRole || 'MEMBER',
          actionTag: cleanAction,
          badgeType,
          details: l.details,
          formattedTime: l.formattedTime,
          timestamp: l.timestamp
        };
      });

    return NextResponse.json({
      success: true,
      logs,
      stats: {
        totalSprints: logs.length,
        activeSprints: logs.filter((l) => l.status === 'active').length,
        completedSprints: logs.filter((l) => l.status === 'completed').length,
        totalTasks: tasks.length,
        doneTasks: tasks.filter((t) => t.status === 'DONE').length,
        inProgressTasks: tasks.filter((t) => t.status === 'IN_PROGRESS').length
      },
      publicStream
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
