import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getMemberBySlug } from '../../../../lib/store';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const isSystemAdmin = session.slug === 'system-admin';
    const memberData = isSystemAdmin ? null : getMemberBySlug(session.slug);

    return NextResponse.json({
      authenticated: true,
      user: {
        slug: session.slug,
        name: isSystemAdmin ? 'System Administrator' : (memberData?.name || session.name),
        username: session.username,
        role: session.role,
        roleTitle: isSystemAdmin ? 'Project Super Admin' : (memberData?.role || session.roleTitle),
        email: isSystemAdmin ? 'admin@teamrandom.uiu.ac.bd' : (memberData?.email || session.email),
        image: memberData?.image || null,
        initials: isSystemAdmin ? 'SA' : (memberData?.initials || 'TR'),
        tagline: isSystemAdmin ? 'Master Workspace Management & Oversight' : (memberData?.tagline || ''),
        id: isSystemAdmin ? 'admin' : (memberData?.id || session.username),
        placeholder: memberData?.placeholder || false
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
