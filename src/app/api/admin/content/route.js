import { NextResponse } from 'next/server';
import Content from '../../../../models/Content';
import { connectToDatabase } from '../../../../lib/mongodb';
import { verifyAdmin } from '../../../../lib/auth';

export async function GET(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectToDatabase();
    const content = await Content.find({});
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching content', error }, { status: 500 });
  }
}

export async function DELETE(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Content.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Content deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting content', error }, { status: 500 });
  }
}

export async function PUT(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectToDatabase();
    const { id, ...updates } = await request.json();
    await Content.findByIdAndUpdate(id, updates);
    return NextResponse.json({ message: 'Content updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating content', error }, { status: 500 });
  }
}