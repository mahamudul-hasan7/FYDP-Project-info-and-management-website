import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { createTeamNote, getAllNotes } from '../../../../lib/store';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const notes = await getAllNotes();
    return NextResponse.json({ success: true, notes });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const created = await createTeamNote(body, session);

    return NextResponse.json({
      success: true,
      message: 'Team note posted!',
      note: created
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Note ID required' }, { status: 400 });
    }

    const { deleteTeamNote } = await import('../../../../lib/store');
    await deleteTeamNote(id, session);

    return NextResponse.json({ success: true, message: 'Note deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
