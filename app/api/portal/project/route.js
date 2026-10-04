import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getProjectInfo, updateProjectInfo } from '../../../../lib/store';

export async function GET() {
  try {
    const project = await getProjectInfo();
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden: Only Project Admin / Technical Lead can update project info.' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await updateProjectInfo(body, session);

    return NextResponse.json({
      success: true,
      message: 'Project info updated successfully!',
      project: updated
    });
  } catch (error) {
    const status = error.message.includes('Forbidden') ? 403 : error.message.includes('Unauthorized') ? 401 : 400;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
