const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Enrollment = require('../models/Enrollment');

/**
 * Check Enrollment Middleware
 * يتحقق من تسجيل الطالب في الدورة
 */
exports.checkEnrollment = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.courseId;

  if (!courseId) {
    return next(new ErrorResponse('معرف الدورة مطلوب', 400));
  }

  // التحقق من التسجيل
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  // إضافة الـ enrollment للـ request
  req.enrollment = enrollment;

  next();
});

/**
 * Check Course Completion Middleware
 * يتحقق من إكمال الدورة (للتقييم والشهادات)
 */
exports.checkCompletion = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.courseId;

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  if (enrollment.overallProgress < 100) {
    return next(
      new ErrorResponse(
        'يجب إكمال الدورة بالكامل أولاً',
        403
      )
    );
  }

  req.enrollment = enrollment;
  next();
});
