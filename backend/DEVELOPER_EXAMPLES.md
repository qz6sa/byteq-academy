# 💡 أمثلة وأنماط للمطورين - ByTeq Academy

هذا الملف يحتوي على أنماط وأمثلة لمساعدتك في إكمال المشروع بسرعة

---

## 📝 Pattern 1: Controller أساسي

### مثال: Course Controller

```javascript
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const ApiFeatures = require('../utils/apiFeatures');

/**
 * @desc    جلب جميع الدورات
 * @route   GET /api/courses
 * @access  Public
 */
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  // إنشاء query
  const features = new ApiFeatures(
    Course.find({ isPublished: true }),
    req.query
  )
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // تنفيذ Query
  const courses = await features.query.populate('category', 'name slug');

  // Count للـ Pagination
  const total = await Course.countDocuments({ isPublished: true });

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      pages: Math.ceil(total / features.pagination.limit),
    },
    data: courses,
  });
});

/**
 * @desc    جلب دورة بالـ slug
 * @route   GET /api/courses/:slug
 * @access  Public
 */
exports.getCourseBySlug = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({
    slug: req.params.slug,
    isPublished: true,
  })
    .populate('category', 'name slug')
    .populate('sections')
    .populate('createdBy', 'name profile.avatar');

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    جلب الدورات المميزة
 * @route   GET /api/courses/featured
 * @access  Public
 */
exports.getFeaturedCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({
    isPublished: true,
    isFeatured: true,
  })
    .populate('category', 'name slug')
    .limit(6)
    .sort('-averageRating');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
```

---

## 📝 Pattern 2: Admin Controller (CRUD)

### مثال: Admin Course Controller

```javascript
const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Course = require('../../models/Course');
const { updateCourseStats } = require('../../utils/calculateProgress');

/**
 * @desc    إنشاء دورة جديدة
 * @route   POST /api/admin/courses
 * @access  Private/Admin
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  // إضافة Admin كـ creator
  req.body.createdBy = req.user._id;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    message: 'تم إنشاء الدورة بنجاح',
    data: course,
  });
});

/**
 * @desc    تعديل دورة
 * @route   PUT /api/admin/courses/:id
 * @access  Private/Admin
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // تحديث الإحصائيات
  await updateCourseStats(course._id);

  res.status(200).json({
    success: true,
    message: 'تم تحديث الدورة بنجاح',
    data: course,
  });
});

/**
 * @desc    حذف دورة
 * @route   DELETE /api/admin/courses/:id
 * @access  Private/Admin
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الدورة بنجاح',
  });
});

/**
 * @desc    نشر/إلغاء نشر دورة
 * @route   POST /api/admin/courses/:id/publish
 * @access  Private/Admin
 */
exports.publishCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  course.isPublished = !course.isPublished;
  await course.save();

  res.status(200).json({
    success: true,
    message: `تم ${course.isPublished ? 'نشر' : 'إلغاء نشر'} الدورة بنجاح`,
    data: course,
  });
});
```

---

## 📝 Pattern 3: Enrollment (Complex Logic)

### مثال: Enrollment Controller

```javascript
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const { calculateCourseProgress } = require('../utils/calculateProgress');

/**
 * @desc    التسجيل في دورة
 * @route   POST /api/enrollments/courses/:courseId/enroll
 * @access  Private
 */
exports.enrollInCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;

  // التحقق من وجود الدورة
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

  // تحديث عدد الطلاب في الدورة
  course.studentsEnrolled.push(req.user._id);
  await course.save();

  res.status(201).json({
    success: true,
    message: 'تم التسجيل في الدورة بنجاح',
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

  // جلب الدرس
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  // جلب التسجيل
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: lecture.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  // تحديث التقدم
  const progressIndex = enrollment.progress.findIndex(
    (p) => p.lectureId.toString() === lectureId
  );

  if (progressIndex === -1) {
    // إضافة درس جديد
    enrollment.progress.push({
      lectureId: lectureId,
      completed: true,
      completedAt: Date.now(),
    });
  } else {
    // تحديث درس موجود
    enrollment.progress[progressIndex].completed = true;
    enrollment.progress[progressIndex].completedAt = Date.now();
  }

  await enrollment.save();

  // حساب نسبة الإنجاز
  const progress = await calculateCourseProgress(enrollment._id);

  res.status(200).json({
    success: true,
    message: 'تم إكمال الدرس',
    data: {
      enrollment,
      progress,
    },
  });
});
```

---

## 📝 Pattern 4: Quiz System (Complex)

### مثال: Quiz Controller

```javascript
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    بدء محاولة امتحان
 * @route   POST /api/quizzes/:quizId/start
 * @access  Private
 */
exports.startQuizAttempt = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الامتحان غير موجود', 404));
  }

  // التحقق من التسجيل
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: quiz.courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  // التحقق من عدد المحاولات
  const attemptsCount = await QuizAttempt.countDocuments({
    userId: req.user._id,
    quizId: quiz._id,
  });

  if (attemptsCount >= quiz.attemptsAllowed) {
    return next(
      new ErrorResponse('لقد استنفدت جميع المحاولات المسموحة', 403)
    );
  }

  // جلب الأسئلة
  let questions = await Question.find({ quizId: quiz._id }).sort('order');

  // عشوائية الأسئلة إذا كانت مفعّلة
  if (quiz.shuffleQuestions) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  // إخفاء الإجابات الصحيحة
  const questionsWithoutAnswers = questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    questionType: q.questionType,
    options: q.options.map((opt) => ({ text: opt.text })),
    points: q.points,
  }));

  res.status(200).json({
    success: true,
    data: {
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        attemptsLeft: quiz.attemptsAllowed - attemptsCount,
      },
      questions: questionsWithoutAnswers,
      startedAt: Date.now(),
    },
  });
});

/**
 * @desc    تقديم إجابات الامتحان
 * @route   POST /api/quizzes/:quizId/submit
 * @access  Private
 */
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const { answers, startedAt } = req.body;

  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return next(new ErrorResponse('الامتحان غير موجود', 404));
  }

  // جلب جميع الأسئلة
  const questions = await Question.find({ quizId: quiz._id });

  let score = 0;
  let totalPoints = 0;
  const processedAnswers = [];

  // تصحيح الإجابات
  for (const answer of answers) {
    const question = questions.find(
      (q) => q._id.toString() === answer.questionId
    );

    if (!question) continue;

    totalPoints += question.points;

    // التحقق من الإجابة
    const correctOptions = question.options
      .map((opt, idx) => (opt.isCorrect ? idx : -1))
      .filter((idx) => idx !== -1);

    const isCorrect =
      JSON.stringify(correctOptions.sort()) ===
      JSON.stringify(answer.selectedOptions.sort());

    const pointsEarned = isCorrect ? question.points : 0;
    score += pointsEarned;

    processedAnswers.push({
      questionId: question._id,
      selectedOptions: answer.selectedOptions,
      isCorrect,
      pointsEarned,
    });
  }

  // حساب النسبة المئوية
  const percentage = (score / totalPoints) * 100;
  const passed = percentage >= quiz.passingScore;

  // حساب عدد المحاولات
  const attemptNumber =
    (await QuizAttempt.countDocuments({
      userId: req.user._id,
      quizId: quiz._id,
    })) + 1;

  // إنشاء QuizAttempt
  const attempt = await QuizAttempt.create({
    userId: req.user._id,
    quizId: quiz._id,
    courseId: quiz.courseId,
    answers: processedAnswers,
    score,
    totalPoints,
    percentage: Math.round(percentage),
    passed,
    attemptNumber,
    startedAt,
    completedAt: Date.now(),
    timeSpent: Math.floor((Date.now() - new Date(startedAt)) / 1000),
  });

  // تحديث Enrollment
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: quiz.courseId,
  });

  if (enrollment) {
    const quizResultIndex = enrollment.quizResults.findIndex(
      (qr) => qr.quizId.toString() === quiz._id.toString()
    );

    if (quizResultIndex === -1) {
      enrollment.quizResults.push({
        quizId: quiz._id,
        bestScore: percentage,
        bestAttemptId: attempt._id,
        totalAttempts: 1,
        lastAttemptAt: Date.now(),
        passed,
      });
    } else {
      enrollment.quizResults[quizResultIndex].totalAttempts += 1;
      enrollment.quizResults[quizResultIndex].lastAttemptAt = Date.now();

      if (percentage > enrollment.quizResults[quizResultIndex].bestScore) {
        enrollment.quizResults[quizResultIndex].bestScore = percentage;
        enrollment.quizResults[quizResultIndex].bestAttemptId = attempt._id;
        enrollment.quizResults[quizResultIndex].passed = passed;
      }
    }

    await enrollment.save();
  }

  res.status(201).json({
    success: true,
    message: passed ? 'مبروك! لقد نجحت' : 'للأسف، لم تنجح. حاول مرة أخرى',
    data: {
      attemptId: attempt._id,
      score,
      totalPoints,
      percentage: Math.round(percentage),
      passed,
      passingScore: quiz.passingScore,
      timeSpent: attempt.timeSpent,
    },
  });
});
```

---

## 📝 Pattern 5: Routes

### مثال: Course Routes

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseBySlug,
  getFeaturedCourses,
  getFreeCourses,
  getCoursesByCategory,
  getCoursePreview,
} = require('../controllers/courseController');

// Public routes
router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/free', getFreeCourses);
router.get('/category/:categorySlug', getCoursesByCategory);
router.get('/:slug', getCourseBySlug);
router.get('/:id/preview', getCoursePreview);

module.exports = router;
```

### مثال: Admin Routes مع Middleware

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  toggleFeatured,
} = require('../../controllers/admin/adminCourseController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات - Admin فقط
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllCourses).post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

router.post('/:id/publish', publishCourse);
router.put('/:id/featured', toggleFeatured);

module.exports = router;
```

---

## 📝 Pattern 6: Validator

### مثال: Course Validator

```javascript
const { check } = require('express-validator');

exports.createCourseValidator = [
  check('title').trim().notEmpty().withMessage('عنوان الدورة مطلوب'),

  check('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('الوصف القصير مطلوب')
    .isLength({ max: 160 })
    .withMessage('الوصف القصير طويل جداً'),

  check('description').trim().notEmpty().withMessage('الوصف مطلوب'),

  check('category').isMongoId().withMessage('معرف الفئة غير صالح'),

  check('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('المستوى غير صالح'),

  check('language')
    .isIn(['arabic', 'english'])
    .withMessage('اللغة غير صالحة'),

  check('price')
    .isNumeric()
    .withMessage('السعر يجب أن يكون رقم')
    .isFloat({ min: 0 })
    .withMessage('السعر غير صالح'),
];

exports.updateCourseValidator = [
  check('title').optional().trim().notEmpty().withMessage('العنوان فارغ'),
  // ... بقية الحقول
];
```

---

## 🎯 نصائح سريعة

### 1. استخدام asyncHandler دائماً
```javascript
exports.myController = asyncHandler(async (req, res, next) => {
  // لا حاجة لـ try-catch
});
```

### 2. استخدام ErrorResponse للأخطاء
```javascript
if (!item) {
  return next(new ErrorResponse('العنصر غير موجود', 404));
}
```

### 3. Populate للعلاقات
```javascript
const course = await Course.findById(id)
  .populate('category', 'name slug')
  .populate('sections');
```

### 4. استخدام ApiFeatures للبحث
```javascript
const features = new ApiFeatures(Model.find(), req.query)
  .search()
  .filter()
  .sort()
  .paginate();

const results = await features.query;
```

### 5. Response موحد
```javascript
res.status(200).json({
  success: true,
  message: 'رسالة النجاح',
  data: result,
  count: items.length,
  pagination: { ... }
});
```

---

## 📚 الموارد

- راجع الملفات الموجودة للأنماط
- استخدم `authController.js` كمرجع
- استخدم `adminCategoryController.js` للـ CRUD
- راجع Models للعلاقات

---

**✨ بالتوفيق!**
