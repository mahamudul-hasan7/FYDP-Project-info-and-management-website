import { NextResponse } from 'next/server';
import { getProjectInfo } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const project = getProjectInfo();
    return NextResponse.json({
      success: true,
      project
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
