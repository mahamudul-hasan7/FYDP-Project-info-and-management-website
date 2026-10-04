import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getBannerConfig, updateBannerConfig } from '../../../../lib/store';

export async function GET() {
  try {
    const config = await getBannerConfig();
    return NextResponse.json({ success: true, config });
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
      return NextResponse.json({ success: false, message: 'Forbidden: Super Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await updateBannerConfig(body, session);
    return NextResponse.json({ success: true, config: updated, message: 'Banner media settings updated!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
