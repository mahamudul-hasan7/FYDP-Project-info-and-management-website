import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getAllMembers, getMemberBySlug, updateMemberProfile, isProjectAdmin, getCloudDbStatus } from '../../../../lib/store';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = isProjectAdmin(session);
    const { searchParams } = new URL(request.url);
    let targetSlug = searchParams.get('slug') || (isAdmin ? 'md-mahamudul-hasan' : session.slug);
    if (isAdmin && targetSlug === 'system-admin') {
      targetSlug = 'md-mahamudul-hasan';
    }

    // If requesting another member's profile and not admin, restrict
    if (targetSlug !== session.slug && !isAdmin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const member = await getMemberBySlug(targetSlug);
    const allMembers = isAdmin ? await getAllMembers() : null;
    const cloudStatus = getCloudDbStatus();

    return NextResponse.json({
      success: true,
      member,
      allMembers,
      cloudStatus
    });
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

    const body = await request.json();
    const { slug, ...updateData } = body || {};

    const targetSlug = slug || session.slug;
    const updated = await updateMemberProfile(targetSlug, updateData, session);
    const cloudStatus = getCloudDbStatus();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      member: updated,
      cloudStatus
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
