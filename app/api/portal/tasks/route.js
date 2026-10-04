import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import {
  createDirectiveTask,
  deleteDirectiveTask,
  getAllTasks,
  updateDirectiveTask
} from '../../../../lib/store';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await getAllTasks();
    return NextResponse.json({ success: true, tasks });
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
    const created = await createDirectiveTask(body, session);

    return NextResponse.json({
      success: true,
      message: 'Directive task created!',
      task: created
    });
  } catch (error) {
    const status = error.message.includes('Forbidden') ? 403 : error.message.includes('Unauthorized') ? 401 : 400;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Task ID required' }, { status: 400 });
    }

    const updated = await updateDirectiveTask(id, updateData, session);
    return NextResponse.json({
      success: true,
      message: 'Task updated!',
      task: updated
    });
  } catch (error) {
    const status = error.message.includes('Forbidden') ? 403 : error.message.includes('Unauthorized') ? 401 : 400;
    return NextResponse.json({ success: false, message: error.message }, { status });
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
      return NextResponse.json({ success: false, message: 'Task ID required' }, { status: 400 });
    }

    await deleteDirectiveTask(id, session);
    return NextResponse.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    const status = error.message.includes('Forbidden') ? 403 : error.message.includes('Unauthorized') ? 401 : 400;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
