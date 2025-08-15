import { connectToDatabase } from '@/lib/mongodb';
import Content from '@/models/Content';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');
  const learningGoal = searchParams.get('learningGoal');
  const search = searchParams.get('search');

  let query = {};

  if (subject) {
    query.subject = subject;
  }
  if (grade) {
    query.grade = grade;
  }
  if (learningGoal) {
    query.learningGoal = learningGoal;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const content = await Content.find(query);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const content = await Content.create(body);
    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}