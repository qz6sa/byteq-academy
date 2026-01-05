const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/byteq-academy');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'instructor', 'admin'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    const existingUser = await User.findOne({ email: 'support@byteqacademy.com' });
    if (existingUser) {
      existingUser.role = 'admin';
      existingUser.isEmailVerified = true;
      await existingUser.save();
      console.log(' تم تحديث المستخدم إلى Admin');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        firstName: 'Admin',
        lastName: 'ByTeq',
        email: 'support@byteqacademy.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true
      });
      console.log(' تم إنشاء حساب Admin بنجاح');
      console.log(' Email: support@byteqacademy.com');
      console.log(' Password: Admin@123');
    }
    process.exit(0);
  } catch (error) {
    console.error(' خطأ:', error.message);
    process.exit(1);
  }
}

createAdmin();
