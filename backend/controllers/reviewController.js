const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    جلب تقييمات دورة
 * @route   GET /api/reviews/courses/:courseId
 * @access  Public
 */
exports.getCourseReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({
    courseId: req.params.courseId,
    isApproved: true,
  })
    .populate('userId', 'name profile.avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    إضافة تقييم
 * @route   POST /api/reviews/courses/:courseId
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: req.params.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('يجب التسجيل في الدورة أولاً', 403));
  }

  if (enrollment.overallProgress < 100) {
    return next(new ErrorResponse('يجب إكمال الدورة لإضافة تقييم', 403));
  }

  const existingReview = await Review.findOne({
    userId: req.user._id,
    courseId: req.params.courseId,
  });

  if (existingReview) {
    return next(new ErrorResponse('لقد قيّمت هذه الدورة مسبقاً', 400));
  }

  const review = await Review.create({
    userId: req.user._id,
    courseId: req.params.courseId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: 'تم إضافة التقييم بنجاح',
    data: review,
  });
});

/**
 * @desc    تعديل تقييمي
 * @route   PUT /api/reviews/:reviewId
 * @access  Private
 */
exports.updateMyReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(new ErrorResponse('التقييم غير موجود', 404));
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('غير مصرح لك بتعديل هذا التقييم', 403));
  }

  review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'تم تحديث التقييم بنجاح',
    data: review,
  });
});

/**
 * @desc    حذف تقييمي
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private
 */
exports.deleteMyReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(new ErrorResponse('التقييم غير موجود', 404));
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('غير مصرح لك بحذف هذا التقييم', 403));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف التقييم بنجاح',
  });
});

/**
 * @desc    تسجيل helpful
 * @route   POST /api/reviews/:reviewId/helpful
 * @access  Private
 */
exports.markHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(new ErrorResponse('التقييم غير موجود', 404));
  }

  const alreadyMarked = review.helpful.includes(req.user._id);

  if (alreadyMarked) {
    review.helpful = review.helpful.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    review.helpfulCount -= 1;
  } else {
    review.helpful.push(req.user._id);
    review.helpfulCount += 1;
  }

  await review.save();

  res.status(200).json({
    success: true,
    message: alreadyMarked ? 'تم إلغاء التسجيل' : 'تم التسجيل بنجاح',
    data: review,
  });
});
