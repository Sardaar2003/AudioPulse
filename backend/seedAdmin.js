const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/audio_analysis_db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding admin user...');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@audioapp.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    const existingAdmin = await User.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (existingAdmin) {
      console.log(`Admin account (${adminEmail}) already exists. Setting password, role='admin', and status='approved'...`);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.status = 'approved';
      await existingAdmin.save();
      console.log('🎉 Admin account updated with new password!');
    } else {

      const adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'approved',
      });

      console.log('🎉 Default Admin user created successfully!');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
