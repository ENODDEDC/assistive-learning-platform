import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { connectToDatabase } from '../../../../lib/mongodb';
import { verifyAdmin } from '../../../../lib/auth';

export async function GET(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectToDatabase();
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
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
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
  }
}

export async function PUT(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectToDatabase();
    const { id, ...updateData } = await request.json();
    await User.findByIdAndUpdate(id, updateData);
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating user role', error }, { status: 500 });
  }
}