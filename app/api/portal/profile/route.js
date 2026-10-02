import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getAllMembers, getMemberBySlug, updateMemberProfile } from '../../../../lib/store';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let targetSlug = searchParams.get('slug') || (session.role === 'ADMIN' ? 'md-mahamudul-hasan' : session.slug);
    if (session.role === 'ADMIN' && targetSlug === 'system-admin') {
      targetSlug = 'md-mahamudul-hasan';
    }

    // If requesting another member's profile and not admin, restrict
    if (targetSlug !== session.slug && session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const member = getMemberBySlug(targetSlug);
    const allMembers = session.role === 'ADMIN' ? getAllMembers() : null;

    return NextResponse.json({
      success: true,
      member,
      allMembers
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
    const updated = updateMemberProfile(targetSlug, updateData, session);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      member: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
