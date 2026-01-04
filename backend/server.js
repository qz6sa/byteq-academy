require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const colors = require('colors');
const connectDB = require('./config/db');

// تهيئة التطبيق
const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// ================================
// Middleware للأمان
// ================================

// Helmet للحماية من ثغرات HTTP headers
app.use(helmet());

// CORS - السماح للـ Frontend بالوصول
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// منع NoSQL Injection
app.use(mongoSanitize());

// منع XSS attacks
app.use(xss());

// Static files
app.use(express.static('public'));

// ================================
// Rate Limiting
// ================================
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 1000, // 1000 طلب (زيادة للتطوير)
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح من الطلبات. حاول مرة أخرى لاحقاً',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// تطبيق rate limiting على جميع المسارات
app.use('/api/', limiter);

// ================================
// الصفحة الرئيسية
// ================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'مرحباً بك في ByTeq Academy API 🚀',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// ================================
// Routes - سيتم إضافتها تدريجياً
// ================================

// ================================
// Public Routes
// ================================

// Authentication Routes
app.use('/api/auth', require('./routes/authRoutes'));

// User Routes
app.use('/api/users', require('./routes/userRoutes'));

// Category Routes
app.use('/api/categories', require('./routes/categoryRoutes'));

// Course Routes
app.use('/api/courses', require('./routes/courseRoutes'));

// Enrollment Routes
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

// Quiz Routes
app.use('/api/quizzes', require('./routes/quizRoutes'));

// Review Routes
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Certificate Routes
app.use('/api/certificates', require('./routes/certificateRoutes'));

// Search Routes
app.use('/api/search', require('./routes/searchRoutes'));

// ================================
// Admin Routes
// ================================

// Admin Dashboard
app.use('/api/admin/dashboard', require('./routes/admin/adminDashboardRoutes'));

// Admin Categories
app.use('/api/admin/categories', require('./routes/admin/adminCategoryRoutes'));

// Admin Sections (Nested under courses) - يجب أن تأتي قبل admin courses
const adminSectionRoutes = require('./routes/admin/adminSectionRoutes');
app.use('/api/admin/courses/:courseId/sections', adminSectionRoutes);

// Admin Lectures (Nested under sections)
const adminLectureRoutes = require('./routes/admin/adminLectureRoutes');
app.use('/api/admin/courses/:courseId/sections/:sectionId/lectures', adminLectureRoutes);

// Admin Quizzes (Nested under sections)
const adminQuizRoutes = require('./routes/admin/adminQuizRoutes');
app.use('/api/admin/courses/:courseId/sections/:sectionId/quizzes', adminQuizRoutes);

// Admin Courses & Nested Routes - يجب أن تأتي بعد nested routes
app.use('/api/admin/courses', require('./routes/admin/adminCourseRoutes'));

// Admin Users
app.use('/api/admin/users', require('./routes/admin/adminUserRoutes'));

// Admin Reviews
app.use('/api/admin/reviews', require('./routes/admin/adminReviewRoutes'));

// Admin Enrollments
app.use('/api/admin/enrollments', require('./routes/admin/adminEnrollmentRoutes'));

// Admin Upload
app.use('/api/admin/upload', require('./routes/admin/adminUploadRoutes'));

// ================================
// Error Handler
// ================================
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ================================
// 404 Handler
// ================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    path: req.originalUrl,
  });
});

// ================================
// Server
// ================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
  console.log(`📍 URL: http://localhost:${PORT}`.yellow);
  console.log(`\n✨ ByTeq Academy API is ready!\n`.green.bold);
});

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`.red.bold);
  process.exit(1);
});

module.exports = app;
