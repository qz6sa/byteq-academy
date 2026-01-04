const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const ApiFeatures = require('../utils/apiFeatures');

/**
 * @desc    جلب جميع الدورات المنشورة
 * @route   GET /api/courses
 * @access  Public
 */
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  // إنشاء query للدورات المنشورة فقط
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
  const courses = await features.query
    .populate('category', 'name slug')
    .populate('createdBy', 'name');

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
    .sort('-averageRating -createdAt');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * @desc    جلب الدورات المجانية
 * @route   GET /api/courses/free
 * @access  Public
 */
exports.getFreeCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({
    isPublished: true,
    isFree: true,
  })
    .populate('category', 'name slug')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * @desc    جلب دورات حسب الفئة
 * @route   GET /api/courses/category/:categorySlug
 * @access  Public
 */
exports.getCoursesByCategory = asyncHandler(async (req, res, next) => {
  const Category = require('../models/Category');
  
  const category = await Category.findOne({ slug: req.params.categorySlug });

  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  const courses = await Course.find({
    category: category._id,
    isPublished: true,
  })
    .populate('category', 'name slug')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: courses.length,
    category: {
      name: category.name,
      slug: category.slug,
    },
    data: courses,
  });
});

/**
 * @desc    جلب تفاصيل دورة بالـ slug
 * @route   GET /api/courses/:slug
 * @access  Public
 */
exports.getCourseBySlug = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({
    slug: req.params.slug,
    isPublished: true,
  })
    .populate('category', 'name slug')
    .populate({
      path: 'sections',
      select: 'title description order totalDuration totalLectures',
    })
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
 * @desc    معاينة محتوى الدورة (الدروس المجانية)
 * @route   GET /api/courses/:id/preview
 * @access  Public
 */
exports.getCoursePreview = asyncHandler(async (req, res, next) => {
  const Section = require('../models/Section');
  const Lecture = require('../models/Lecture');

  const course = await Course.findById(req.params.id)
    .populate('category', 'name slug');

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  // جلب الأقسام
  const sections = await Section.find({ courseId: course._id }).sort('order');

  // جلب الدروس المجانية فقط
  const freeLectures = await Lecture.find({
    courseId: course._id,
    isFree: true,
  }).sort('order');

  res.status(200).json({
    success: true,
    data: {
      course: {
        _id: course._id,
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        thumbnail: course.thumbnail,
        previewVideoUrl: course.previewVideoUrl,
        level: course.level,
        language: course.language,
        price: course.price,
        discountPrice: course.discountPrice,
        totalDuration: course.totalDuration,
        totalLectures: course.totalLectures,
        totalSections: course.totalSections,
        category: course.category,
      },
      sections: sections.map(s => ({
        _id: s._id,
        title: s.title,
        order: s.order,
        totalLectures: s.totalLectures,
      })),
      freeLectures,
    },
  });
});
