const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Review = require('../../models/Review');

/**
 * @desc    جلب جميع التقييمات (Admin)
 * @route   GET /api/admin/reviews
 * @access  Private/Admin
 */
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find()
    .populate('userId', 'name email')
    .populate('courseId', 'title')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    الموافقة على تقييم (Admin)
 * @route   PUT /api/admin/reviews/:reviewId/approve
 * @access  Private/Admin
 */
exports.approveReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(new ErrorResponse('التقييم غير موجود', 404));
  }

  review.isApproved = true;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'تم قبول التقييم',
    data: review,
  });
});

/**
 * @desc    حذف تقييم (Admin)
 * @route   DELETE /api/admin/reviews/:reviewId
 * @access  Private/Admin
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(new ErrorResponse('التقييم غير موجود', 404));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف التقييم بنجاح',
  });
});
