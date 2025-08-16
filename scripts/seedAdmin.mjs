import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js'; // Adjust path as needed
import { connectToDatabase } from '../src/lib/mongodb.js';

async function seedAdmin() {
  try {
    await connectToDatabase();
    console.log('MongoDB connected for seeding.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@email.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      // Optionally update password if needed
      // const hashedPassword = await bcrypt.hash(adminPassword, 10);
      // existingAdmin.password = hashedPassword;
      // await existingAdmin.save();
      // console.log('Admin password updated.');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        name: 'Admin',
        middleName: '',
        surname: 'User',
        suffix: '',
        email: adminEmail,
        password: hashedPassword,
        otp: null,
        otpExpires: null,
        isVerified: true,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        role: 'admin',
      });
      await newAdmin.save();
      console.log(`Admin user ${adminEmail} created successfully.`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

seedAdmin();