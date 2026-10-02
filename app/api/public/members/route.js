import { NextResponse } from 'next/server';
import { getAllMembers } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const members = getAllMembers() || [];
    return NextResponse.json({
      success: true,
      members,
      count: members.length
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
