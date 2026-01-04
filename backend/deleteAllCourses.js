require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Section = require('./models/Section');
const Lecture = require('./models/Lecture');
const colors = require('colors');

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// حذف جميع الدورات
const deleteAllCourses = async () => {
  try {
    console.log('\n🗑️  بدء حذف جميع الدورات...'.yellow.bold);
    
    // حذف جميع Lectures
    const deletedLectures = await Lecture.deleteMany({});
    console.log(`✅ تم حذف ${deletedLectures.deletedCount} محاضرة`.green);
    
    // حذف جميع Sections
    const deletedSections = await Section.deleteMany({});
    console.log(`✅ تم حذف ${deletedSections.deletedCount} قسم`.green);
    
    // حذف جميع Courses
    const deletedCourses = await Course.deleteMany({});
    console.log(`✅ تم حذف ${deletedCourses.deletedCount} دورة`.green);
    
    console.log('\n✨ تم حذف جميع الدورات بنجاح!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error(`❌ خطأ في الحذف: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// تشغيل السكريبت
const run = async () => {
  await connectDB();
  await deleteAllCourses();
};

run();
