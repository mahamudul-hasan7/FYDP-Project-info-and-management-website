import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { createWeeklyLog, deleteWeeklyLog, getAllLogs, getCloudDbStatus } from '../../../../lib/store';

export async function GET() {
  const logs = await getAllLogs();
  const cloudStatus = getCloudDbStatus();
  return NextResponse.json({ success: true, logs, cloudStatus });
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const created = await createWeeklyLog(body, session);
    const cloudStatus = getCloudDbStatus();

    return NextResponse.json({
      success: true,
      message: 'Weekly sprint update published!',
      log: created,
      cloudStatus
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const logId = parseInt(searchParams.get('id'), 10);

    await deleteWeeklyLog(logId, session);
    const cloudStatus = getCloudDbStatus();

    return NextResponse.json({ success: true, message: 'Log deleted.', cloudStatus });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
