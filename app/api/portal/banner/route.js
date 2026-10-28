import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getBannerConfig, updateBannerConfig, isProjectAdmin, getCloudDbStatus } from '../../../../lib/store';

export async function GET() {
  try {
    const config = await getBannerConfig();
    const cloudStatus = getCloudDbStatus();
    return NextResponse.json({ success: true, config, cloudStatus });
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
    if (!isProjectAdmin(session)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Super Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await updateBannerConfig(body, session);
    const cloudStatus = getCloudDbStatus();
    return NextResponse.json({ success: true, config: updated, cloudStatus, message: 'Banner media settings updated!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
