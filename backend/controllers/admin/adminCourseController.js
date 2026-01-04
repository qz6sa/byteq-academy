const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Course = require('../../models/Course');
const Category = require('../../models/Category');
const Section = require('../../models/Section');
const Lecture = require('../../models/Lecture');
const { updateCourseStats } = require('../../utils/calculateProgress');

/**
 * @desc    جلب جميع الدورات (Admin)
 * @route   GET /api/admin/courses
 * @access  Private/Admin
 */
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find()
    .populate('category', 'name')
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * @desc    إنشاء دورة جديدة
 * @route   POST /api/admin/courses
 * @access  Private/Admin
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  // التحقق من الفئة
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  // استخراج sections من البيانات
  const { sections: sectionsData, ...courseData } = req.body;

  // إضافة Admin كـ creator
  courseData.createdBy = req.user._id;

  // إنشاء الدورة أولاً بدون sections
  const course = await Course.create(courseData);

  // إنشاء Sections و Lectures إذا تم إرسالها
  if (sectionsData && Array.isArray(sectionsData) && sectionsData.length > 0) {
    const sectionIds = [];

    for (const sectionData of sectionsData) {
      const { lectures: lecturesData, ...sectionInfo } = sectionData;
      
      // إنشاء Section أولاً (بدون lectures)
      const section = await Section.create({
        ...sectionInfo,
        courseId: course._id,
        lectures: [], // سنضيفها لاحقاً
      });
      
      // إنشاء Lectures مع courseId و sectionId
      const lectureIds = [];
      if (lecturesData && Array.isArray(lecturesData)) {
        for (const lectureData of lecturesData) {
          const lecture = await Lecture.create({
            ...lectureData,
            courseId: course._id,
            sectionId: section._id,
          });
          lectureIds.push(lecture._id);
        }
      }

      // تحديث Section بـ lectures IDs
      section.lectures = lectureIds;
      await section.save();
      
      sectionIds.push(section._id);
    }

    // تحديث Course بـ sections IDs
    course.sections = sectionIds;
    await course.save();

    // تحديث الإحصائيات
    await updateCourseStats(course._id);
  }

  // تحديث عدد الدورات في الفئة
  category.coursesCount += 1;
  await category.save();

  // إرجاع الدورة مع جميع البيانات
  const populatedCourse = await Course.findById(course._id)
    .populate({
      path: 'sections',
      populate: { path: 'lectures' },
    })
    .populate('category');

  res.status(201).json({
    success: true,
    message: 'تم إنشاء الدورة بنجاح',
    data: populatedCourse,
  });
});

/**
 * @desc    جلب تفاصيل دورة
 * @route   GET /api/admin/courses/:id
 * @access  Private/Admin
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('category')
    .populate({
      path: 'sections',
      populate: { path: 'lectures' },
      options: { strictPopulate: false }
    })
    .populate('createdBy', 'name email');

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  res.status(200).json({
    success: true,
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

  // استخراج sections من البيانات
  const { sections: sectionsData, ...courseData } = req.body;

  // تحديث بيانات الدورة الأساسية
  course = await Course.findByIdAndUpdate(req.params.id, courseData, {
    new: true,
    runValidators: true,
  });

  // تحديث Sections و Lectures إذا تم إرسالها
  if (sectionsData && Array.isArray(sectionsData)) {
    // حذف Sections القديمة والـ Lectures المرتبطة بها
    const oldSections = await Section.find({ courseId: course._id });
    for (const section of oldSections) {
      await Lecture.deleteMany({ _id: { $in: section.lectures } });
      await Section.findByIdAndDelete(section._id);
    }

    // إنشاء Sections و Lectures الجديدة
    const sectionIds = [];
    for (const sectionData of sectionsData) {
      const { lectures: lecturesData, ...sectionInfo } = sectionData;
      
      // إنشاء Section أولاً (بدون lectures)
      const section = await Section.create({
        ...sectionInfo,
        courseId: course._id,
        lectures: [], // سنضيفها لاحقاً
      });
      
      // إنشاء Lectures مع courseId و sectionId
      const lectureIds = [];
      if (lecturesData && Array.isArray(lecturesData)) {
        for (const lectureData of lecturesData) {
          const lecture = await Lecture.create({
            ...lectureData,
            courseId: course._id,
            sectionId: section._id,
          });
          lectureIds.push(lecture._id);
        }
      }

      // تحديث Section بـ lectures IDs
      section.lectures = lectureIds;
      await section.save();
      
      sectionIds.push(section._id);
    }

    // تحديث Course بـ sections IDs الجديدة
    course.sections = sectionIds;
    await course.save();
  }

  // تحديث الإحصائيات
  await updateCourseStats(course._id);

  // إرجاع الدورة المحدثة مع جميع البيانات
  const populatedCourse = await Course.findById(course._id)
    .populate({
      path: 'sections',
      populate: { path: 'lectures' },
    })
    .populate('category');

  res.status(200).json({
    success: true,
    message: 'تم تحديث الدورة بنجاح',
    data: populatedCourse,
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

  // تحديث عدد الدورات في الفئة
  const category = await Category.findById(course.category);
  if (category && category.coursesCount > 0) {
    category.coursesCount -= 1;
    await category.save();
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الدورة بنجاح',
  });
});

/**
 * @desc    نشر دورة
 * @route   POST /api/admin/courses/:id/publish
 * @access  Private/Admin
 */
exports.publishCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  course.isPublished = true;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'تم نشر الدورة بنجاح',
    data: course,
  });
});

/**
 * @desc    إلغاء نشر دورة
 * @route   POST /api/admin/courses/:id/unpublish
 * @access  Private/Admin
 */
exports.unpublishCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  course.isPublished = false;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'تم إلغاء نشر الدورة',
    data: course,
  });
});

/**
 * @desc    تمييز/إلغاء تمييز دورة
 * @route   PUT /api/admin/courses/:id/featured
 * @access  Private/Admin
 */
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  course.isFeatured = !course.isFeatured;
  await course.save();

  res.status(200).json({
    success: true,
    message: `تم ${course.isFeatured ? 'تمييز' : 'إلغاء تمييز'} الدورة`,
    data: course,
  });
});

/**
 * @desc    تحديث صورة الدورة
 * @route   POST /api/admin/courses/:id/thumbnail
 * @access  Private/Admin
 */
exports.updateThumbnail = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  if (!req.body.thumbnail) {
    return next(new ErrorResponse('الصورة مطلوبة', 400));
  }

  course.thumbnail = req.body.thumbnail;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'تم تحديث صورة الدورة',
    data: course,
  });
});
