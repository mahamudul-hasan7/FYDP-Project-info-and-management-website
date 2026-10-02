import { NextResponse } from 'next/server';
import { changePassword, getSession } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, oldPassword, newPassword } = body || {};

    const targetSlug = slug || session.slug;
    changePassword(targetSlug, oldPassword, newPassword, session);

    const { recordAuditLog } = await import('../../../../lib/store');
    recordAuditLog(
      session.role === 'ADMIN' && targetSlug !== session.slug ? 'ADMIN_PASSWORD_RESET' : 'PASSWORD_CHANGED',
      session.role === 'ADMIN' && targetSlug !== session.slug
        ? `Super Admin override: reset password for ${targetSlug}`
        : `${session.name} changed workspace security password`,
      session,
      'SECURITY'
    );

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
