require('dotenv').config();
require('colors');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const User = require('../models/User');

// الاتصال بقاعدة البيانات
connectDB();

// الفئات الأساسية لـ ByTeq Academy
const initialCategories = [
  {
    name: 'مسار الأمن السيبراني',
    slug: 'cybersecurity-track',
    description: 'مسار شامل في الأمن السيبراني واختبار الاختراق والحماية الرقمية',
    icon: '🔐',
    order: 1,
    isActive: true,
  },
  {
    name: 'مسار لغات البرمجة',
    slug: 'programming-languages-track',
    description: 'تعلم لغات البرمجة من الصفر حتى الاحتراف - Python, JavaScript, Java وغيرها',
    icon: '💻',
    order: 2,
    isActive: true,
  },
  {
    name: 'مسار البنية التحتية والشبكات',
    slug: 'infrastructure-networks-track',
    description: 'أساسيات البنية التحتية وإدارة الشبكات والخوادم',
    icon: '🌐',
    order: 3,
    isActive: true,
  },
  {
    name: 'مسار المهارات المتقدمة',
    slug: 'advanced-skills-track',
    description: 'مهارات متقدمة في تطوير البرمجيات والأمن وإدارة المشاريع التقنية',
    icon: '🚀',
    order: 4,
    isActive: true,
  },
];

// Admin مبدئي للتجربة
const adminUser = {
  name: 'Admin',
  email: 'admin@byteqacademy.com',
  password: 'admin123456',
  role: 'admin',
  isEmailVerified: true,
  isActive: true,
};

/**
 * إضافة البيانات الأولية
 */
const seedData = async () => {
  try {
    // حذف البيانات الموجودة
    console.log('🗑️  Deleting existing data...'.yellow);
    await Category.deleteMany();
    await User.deleteMany();

    // إضافة الفئات
    console.log('📦 Adding categories...'.cyan);
    const categories = await Category.insertMany(initialCategories);
    console.log(`✅ ${categories.length} categories added`.green);

    // إضافة Admin
    console.log('👤 Creating admin user...'.cyan);
    const admin = await User.create(adminUser);
    console.log(`✅ Admin created: ${admin.email}`.green);
    console.log(`   Password: admin123456`.yellow);

    console.log('\n✅ Seeding completed successfully!'.green.bold);
    console.log('\n📝 Login credentials:'.cyan.bold);
    console.log(`   Email: ${admin.email}`.white);
    console.log(`   Password: admin123456\n`.white);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

/**
 * حذف جميع البيانات
 */
const deleteData = async () => {
  try {
    console.log('🗑️  Deleting all data...'.red);

    await Category.deleteMany();
    await User.deleteMany();

    console.log('✅ All data deleted successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// تنفيذ الأوامر
if (process.argv[2] === '-d') {
  deleteData();
} else {
  seedData();
}
