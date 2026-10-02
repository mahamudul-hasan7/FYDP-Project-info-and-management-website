import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getAllAuditLogs } from '../../../../lib/store';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const logs = getAllAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
