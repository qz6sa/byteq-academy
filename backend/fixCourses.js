require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Section = require('./models/Section');
const Lecture = require('./models/Lecture');

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// حذف جميع الدورات وإصلاح slugs
const fixCourses = async () => {
  try {
    // حذف كل شيء
    await Lecture.deleteMany({});
    console.log('✅ حذف جميع المحاضرات');
    
    await Section.deleteMany({});
    console.log('✅ حذف جميع الأقسام');
    
    await Course.deleteMany({});
    console.log('✅ حذف جميع الدورات');
    
    console.log('\n✨ تم تنظيف قاعدة البيانات بنجاح!');
    console.log('👉 الآن يمكنك إنشاء دورة جديدة من لوحة التحكم\n');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ خطأ: ${error.message}`);
    process.exit(1);
  }
};

// تشغيل
connectDB().then(() => fixCourses());
