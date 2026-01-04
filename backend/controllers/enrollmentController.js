const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const User = require('../models/User');
const { calculateCourseProgress } = require('../utils/calculateProgress');

/**
 * @desc    التسجيل في دورة
 * @route   POST /api/enrollments/courses/:courseId/enroll
 * @access  Private
 */
exports.enrollInCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  if (!course.isPublished) {
    return next(new ErrorResponse('الدورة غير منشورة', 400));
  }

  // التحقق من التسجيل المسبق
  const existingEnrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: courseId,
  });

  if (existingEnrollment) {
    return next(new ErrorResponse('أنت مسجل في هذه الدورة مسبقاً', 400));
  }

  // إنشاء التسجيل
  const enrollment = await Enrollment.create({
    userId: req.user._id,
    courseId: courseId,
  });

  // تحديث الدورة والمستخدم
  course.studentsEnrolled.push(req.user._id);
  await course.save();

  const user = await User.findById(req.user._id);
  user.enrolledCourses.push({
    courseId: courseId,
    enrolledAt: Date.now(),
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: 'تم التسجيل في الدورة بنجاح',
    data: enrollment,
  });
});

/**
 * @desc    جلب تسجيلاتي
 * @route   GET /api/enrollments/my-enrollments
 * @access  Private
 */
exports.getMyEnrollments = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.find({ userId: req.user._id })
    .populate('courseId', 'title thumbnail price level language totalDuration')
    .sort('-enrolledAt');

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments,
  });
});

/**
 * @desc    تفاصيل تسجيلي في دورة
 * @route   GET /api/enrollments/courses/:courseId
 * @access  Private
 */
exports.getEnrollmentDetails = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: req.params.courseId,
  })
    .populate('courseId')
    .populate('progress.lectureId');

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  res.status(200).json({
    success: true,
    data: enrollment,
  });
});

/**
 * @desc    إكمال درس
 * @route   POST /api/enrollments/lectures/:lectureId/complete
 * @access  Private
 */
exports.completeLecture = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.lectureId;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: lecture.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  const progressIndex = enrollment.progress.findIndex(
    (p) => p.lectureId.toString() === lectureId
  );

  if (progressIndex === -1) {
    enrollment.progress.push({
      lectureId: lectureId,
      completed: true,
      completedAt: Date.now(),
    });
  } else {
    enrollment.progress[progressIndex].completed = true;
    enrollment.progress[progressIndex].completedAt = Date.now();
  }

  await enrollment.save();

  const progress = await calculateCourseProgress(enrollment._id);

  res.status(200).json({
    success: true,
    message: 'تم إكمال الدرس',
    data: { enrollment, progress },
  });
});

/**
 * @desc    تحديث تقدم درس
 * @route   PUT /api/enrollments/lectures/:lectureId/progress
 * @access  Private
 */
exports.updateLectureProgress = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.lectureId;
  const { watchTime } = req.body;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: lecture.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  const progressIndex = enrollment.progress.findIndex(
    (p) => p.lectureId.toString() === lectureId
  );

  if (progressIndex === -1) {
    enrollment.progress.push({
      lectureId: lectureId,
      lastWatchedAt: Date.now(),
      watchTime: watchTime || 0,
    });
  } else {
    enrollment.progress[progressIndex].lastWatchedAt = Date.now();
    enrollment.progress[progressIndex].watchTime = watchTime || 0;
  }

  enrollment.lastAccessedAt = Date.now();
  await enrollment.save();

  res.status(200).json({
    success: true,
    message: 'تم تحديث التقدم',
    data: enrollment,
  });
});
