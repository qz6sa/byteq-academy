const mongoose = require('mongoose');
const colors = require('colors');

/**
 * اتصال MongoDB
 * يتصل بقاعدة البيانات مع خيارات محسّنة
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // خيارات الاتصال المحسّنة
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    console.log(`📦 Database: ${conn.connection.name}`.cyan);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
