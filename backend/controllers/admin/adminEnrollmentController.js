const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Enrollment = require('../../models/Enrollment');

/**
 * @desc    جلب جميع التسجيلات (Admin)
 * @route   GET /api/admin/enrollments
 * @access  Private/Admin
 */
exports.getAllEnrollments = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.find()
    .populate('userId', 'name email')
    .populate('courseId', 'title price')
    .sort('-enrolledAt');

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments,
  });
});

/**
 * @desc    جلب تسجيل (Admin)
 * @route   GET /api/admin/enrollments/:enrollmentId
 * @access  Private/Admin
 */
exports.getEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.enrollmentId)
    .populate('userId', 'name email profile')
    .populate('courseId')
    .populate('progress.lectureId');

  if (!enrollment) {
    return next(new ErrorResponse('التسجيل غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    data: enrollment,
  });
});

/**
 * @desc    حذف تسجيل (Admin)
 * @route   DELETE /api/admin/enrollments/:enrollmentId
 * @access  Private/Admin
 */
exports.deleteEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.enrollmentId);

  if (!enrollment) {
    return next(new ErrorResponse('التسجيل غير موجود', 404));
  }

  await enrollment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف التسجيل بنجاح',
  });
});
