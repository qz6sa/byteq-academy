const asyncHandler = require('../../utils/asyncHandler');
const User = require('../../models/User');
const Course = require('../../models/Course');
const Enrollment = require('../../models/Enrollment');
const Review = require('../../models/Review');

/**
 * @desc    إحصائيات Dashboard
 * @route   GET /api/admin/dashboard/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // إحصائيات عامة
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalCourses = await Course.countDocuments();
  const totalEnrollments = await Enrollment.countDocuments();
  const totalReviews = await Review.countDocuments();

  // إحصائيات الدورات
  const publishedCourses = await Course.countDocuments({ isPublished: true });
  const freeCourses = await Course.countDocuments({ isFree: true });
  const paidCourses = await Course.countDocuments({ isFree: false });

  // أحدث التسجيلات
  const recentEnrollments = await Enrollment.find()
    .populate('userId', 'name email')
    .populate('courseId', 'title thumbnail')
    .sort('-enrolledAt')
    .limit(10);

  // أكثر الدورات شعبية
  const popularCourses = await Course.find({ isPublished: true })
    .sort('-studentsCount -averageRating')
    .limit(5)
    .select('title thumbnail studentsCount averageRating price');

  // إحصائيات الإيرادات (للدورات المدفوعة)
  const enrollmentsWithCourses = await Enrollment.find().populate(
    'courseId',
    'price discountPrice'
  );

  let totalRevenue = 0;
  enrollmentsWithCourses.forEach((enrollment) => {
    if (enrollment.courseId && !enrollment.courseId.isFree) {
      const price =
        enrollment.courseId.discountPrice || enrollment.courseId.price;
      totalRevenue += price;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalReviews,
        publishedCourses,
        freeCourses,
        paidCourses,
        totalRevenue,
      },
      recentEnrollments,
      popularCourses,
    },
  });
});

/**
 * @desc    إحصائيات المستخدمين
 * @route   GET /api/admin/dashboard/users-stats
 * @access  Private/Admin
 */
exports.getUsersStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const activeUsers = await User.countDocuments({
    role: 'user',
    isEmailVerified: true,
  });

  // المستخدمون الجدد (آخر 30 يوم)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newUsers = await User.countDocuments({
    role: 'user',
    createdAt: { $gte: thirtyDaysAgo },
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      newUsers,
    },
  });
});

/**
 * @desc    إحصائيات الدورات
 * @route   GET /api/admin/dashboard/courses-stats
 * @access  Private/Admin
 */
exports.getCoursesStats = asyncHandler(async (req, res, next) => {
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ isPublished: true });
  const draftCourses = await Course.countDocuments({ isPublished: false });

  // الدورات حسب المستوى
  const beginner = await Course.countDocuments({ level: 'مبتدئ' });
  const intermediate = await Course.countDocuments({ level: 'متوسط' });
  const advanced = await Course.countDocuments({ level: 'متقدم' });

  res.status(200).json({
    success: true,
    data: {
      totalCourses,
      publishedCourses,
      draftCourses,
      byLevel: {
        beginner,
        intermediate,
        advanced,
      },
    },
  });
});

/**
 * @desc    إحصائيات التسجيلات
 * @route   GET /api/admin/dashboard/enrollments-stats
 * @access  Private/Admin
 */
exports.getEnrollmentsStats = asyncHandler(async (req, res, next) => {
  const totalEnrollments = await Enrollment.countDocuments();

  // معدل الإكمال
  const completedEnrollments = await Enrollment.countDocuments({
    overallProgress: 100,
  });

  const completionRate =
    totalEnrollments > 0
      ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
      : 0;

  // التسجيلات الجديدة (آخر 30 يوم)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newEnrollments = await Enrollment.countDocuments({
    enrolledAt: { $gte: thirtyDaysAgo },
  });

  res.status(200).json({
    success: true,
    data: {
      totalEnrollments,
      completedEnrollments,
      completionRate: parseFloat(completionRate),
      newEnrollments,
    },
  });
});
