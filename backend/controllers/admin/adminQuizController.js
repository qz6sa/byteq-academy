const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Quiz = require('../../models/Quiz');
const Course = require('../../models/Course');

/**
 * @desc    جلب جميع الكويزات (Admin)
 * @route   GET /api/admin/quizzes
 * @access  Private/Admin
 */
exports.getAllQuizzes = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.find()
    .populate('courseId', 'title')
    .populate('sectionId', 'title')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

/**
 * @desc    إنشاء كويز (Admin)
 * @route   POST /api/admin/courses/:courseId/sections/:sectionId/quizzes
 * @access  Private/Admin
 */
exports.createQuiz = asyncHandler(async (req, res, next) => {
  const { courseId, sectionId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  const quiz = await Quiz.create({
    ...req.body,
    courseId,
    sectionId,
  });

  res.status(201).json({
    success: true,
    message: 'تم إنشاء الكويز بنجاح',
    data: quiz,
  });
});

/**
 * @desc    جلب كويز (Admin)
 * @route   GET /api/admin/quizzes/:quizId
 * @access  Private/Admin
 */
exports.getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId)
    .populate('courseId', 'title')
    .populate('sectionId', 'title');

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

/**
 * @desc    تحديث كويز (Admin)
 * @route   PUT /api/admin/quizzes/:quizId
 * @access  Private/Admin
 */
exports.updateQuiz = asyncHandler(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'تم تحديث الكويز بنجاح',
    data: quiz,
  });
});

/**
 * @desc    حذف كويز (Admin)
 * @route   DELETE /api/admin/quizzes/:quizId
 * @access  Private/Admin
 */
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  await quiz.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الكويز بنجاح',
  });
});

/**
 * @desc    تفعيل/إلغاء تفعيل كويز (Admin)
 * @route   PUT /api/admin/quizzes/:quizId/toggle-active
 * @access  Private/Admin
 */
exports.toggleActive = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  quiz.isActive = !quiz.isActive;
  await quiz.save();

  res.status(200).json({
    success: true,
    message: quiz.isActive ? 'تم تفعيل الكويز' : 'تم إلغاء تفعيل الكويز',
    data: quiz,
  });
});
