const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    جلب كويزات دورة
 * @route   GET /api/quizzes/courses/:courseId
 * @access  Private
 */
exports.getCourseQuizzes = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: req.params.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('يجب التسجيل في الدورة أولاً', 403));
  }

  const quizzes = await Quiz.find({
    courseId: req.params.courseId,
    isActive: true,
  })
    .populate('sectionId', 'title')
    .select('-questions.correctAnswer');

  res.status(200).json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

/**
 * @desc    جلب كويز
 * @route   GET /api/quizzes/:quizId
 * @access  Private
 */
exports.getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId).select(
    '-questions.correctAnswer'
  );

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  if (!quiz.isActive) {
    return next(new ErrorResponse('الكويز غير نشط', 400));
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: quiz.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('يجب التسجيل في الدورة أولاً', 403));
  }

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

/**
 * @desc    بدء محاولة كويز
 * @route   POST /api/quizzes/:quizId/start
 * @access  Private
 */
exports.startQuizAttempt = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: quiz.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('يجب التسجيل في الدورة أولاً', 403));
  }

  // التحقق من عدد المحاولات
  const attemptsCount = await QuizAttempt.countDocuments({
    userId: req.user._id,
    quizId: req.params.quizId,
  });

  if (attemptsCount >= quiz.maxAttempts) {
    return next(new ErrorResponse('تجاوزت الحد الأقصى للمحاولات', 400));
  }

  const attempt = await QuizAttempt.create({
    userId: req.user._id,
    quizId: req.params.quizId,
    courseId: quiz.courseId,
    startTime: Date.now(),
  });

  res.status(201).json({
    success: true,
    message: 'بدأ الكويز بنجاح',
    data: attempt,
  });
});

/**
 * @desc    تقديم كويز
 * @route   POST /api/quizzes/:quizId/submit
 * @access  Private
 */
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const { attemptId, answers } = req.body;

  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الكويز غير موجود', 404));
  }

  const attempt = await QuizAttempt.findById(attemptId);

  if (!attempt) {
    return next(new ErrorResponse('المحاولة غير موجودة', 404));
  }

  if (attempt.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('غير مصرح لك', 403));
  }

  if (attempt.isSubmitted) {
    return next(new ErrorResponse('تم تقديم الكويز مسبقاً', 400));
  }

  // حساب النتيجة
  let correctAnswers = 0;
  const results = [];

  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    const userAnswer = answers.find((a) => a.questionId === question._id.toString());

    let isCorrect = false;
    if (userAnswer) {
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        isCorrect = userAnswer.answer === question.correctAnswer;
      } else if (question.type === 'multiple-select') {
        const correctSet = new Set(question.correctAnswer);
        const userSet = new Set(userAnswer.answer);
        isCorrect =
          correctSet.size === userSet.size &&
          [...correctSet].every((ans) => userSet.has(ans));
      }
    }

    if (isCorrect) correctAnswers++;

    results.push({
      questionId: question._id,
      userAnswer: userAnswer ? userAnswer.answer : null,
      isCorrect,
    });
  }

  const score = (correctAnswers / quiz.questions.length) * 100;
  const passed = score >= quiz.passingScore;

  attempt.answers = results;
  attempt.score = score;
  attempt.passed = passed;
  attempt.endTime = Date.now();
  attempt.isSubmitted = true;

  await attempt.save();

  // تحديث Enrollment
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: quiz.courseId,
  });

  if (enrollment) {
    const quizResultIndex = enrollment.quizResults.findIndex(
      (r) => r.quizId.toString() === quiz._id.toString()
    );

    if (quizResultIndex === -1) {
      enrollment.quizResults.push({
        quizId: quiz._id,
        bestScore: score,
        attempts: 1,
      });
    } else {
      const currentBest = enrollment.quizResults[quizResultIndex].bestScore;
      enrollment.quizResults[quizResultIndex].bestScore = Math.max(
        currentBest,
        score
      );
      enrollment.quizResults[quizResultIndex].attempts += 1;
    }

    await enrollment.save();
  }

  res.status(200).json({
    success: true,
    message: passed ? 'نجحت في الكويز!' : 'لم تنجح، حاول مرة أخرى',
    data: {
      score,
      passed,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      attempt,
    },
  });
});

/**
 * @desc    جلب محاولاتي
 * @route   GET /api/quizzes/:quizId/my-attempts
 * @access  Private
 */
exports.getMyAttempts = asyncHandler(async (req, res, next) => {
  const attempts = await QuizAttempt.find({
    userId: req.user._id,
    quizId: req.params.quizId,
  }).sort('-startTime');

  res.status(200).json({
    success: true,
    count: attempts.length,
    data: attempts,
  });
});

/**
 * @desc    نتيجة محاولة
 * @route   GET /api/quizzes/attempts/:attemptId
 * @access  Private
 */
exports.getAttemptResult = asyncHandler(async (req, res, next) => {
  const attempt = await QuizAttempt.findById(req.params.attemptId).populate(
    'quizId',
    'title questions'
  );

  if (!attempt) {
    return next(new ErrorResponse('المحاولة غير موجودة', 404));
  }

  if (attempt.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('غير مصرح لك', 403));
  }

  res.status(200).json({
    success: true,
    data: attempt,
  });
});
