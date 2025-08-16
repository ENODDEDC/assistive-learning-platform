import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { connectToDatabase } from './mongodb';

export async function verifyAdmin(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return { authorized: false, response: NextResponse.json({ message: 'No token provided' }, { status: 401 }) };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return { authorized: false, response: NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 }) };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, response: NextResponse.json({ message: 'Invalid token' }, { status: 401 }) };
  }
}