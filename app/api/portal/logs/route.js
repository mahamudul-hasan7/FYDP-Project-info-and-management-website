import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { createWeeklyLog, deleteWeeklyLog, getAllLogs } from '../../../../lib/store';

export async function GET() {
  const logs = await getAllLogs();
  return NextResponse.json({ success: true, logs });
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const created = await createWeeklyLog(body, session);

    return NextResponse.json({
      success: true,
      message: 'Weekly sprint update published!',
      log: created
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

    return NextResponse.json({ success: true, message: 'Log deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
