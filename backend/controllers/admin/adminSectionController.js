const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Section = require('../../models/Section');
const Course = require('../../models/Course');
const { updateSectionStats, updateCourseStats } = require('../../utils/calculateProgress');

/**
 * @desc    جلب جميع أقسام الدورة
 * @route   GET /api/admin/courses/:courseId/sections
 * @access  Private/Admin
 */
exports.getAllSections = asyncHandler(async (req, res, next) => {
  const sections = await Section.find({ courseId: req.params.courseId })
    .populate('lectures')
    .populate('quizzes')
    .sort('order');

  res.status(200).json({
    success: true,
    count: sections.length,
    data: sections,
  });
});

/**
 * @desc    إضافة قسم جديد
 * @route   POST /api/admin/courses/:courseId/sections
 * @access  Private/Admin
 */
exports.createSection = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  const section = await Section.create({
    ...req.body,
    courseId: req.params.courseId,
  });

  // إضافة القسم للدورة
  course.sections.push(section._id);
  await course.save();

  // تحديث إحصائيات الدورة
  await updateCourseStats(course._id);

  res.status(201).json({
    success: true,
    message: 'تم إضافة القسم بنجاح',
    data: section,
  });
});

/**
 * @desc    جلب تفاصيل قسم
 * @route   GET /api/admin/courses/:courseId/sections/:sectionId
 * @access  Private/Admin
 */
exports.getSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.sectionId)
    .populate('lectures')
    .populate('quizzes');

  if (!section) {
    return next(new ErrorResponse('القسم غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    data: section,
  });
});

/**
 * @desc    تعديل قسم
 * @route   PUT /api/admin/courses/:courseId/sections/:sectionId
 * @access  Private/Admin
 */
exports.updateSection = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.sectionId);

  if (!section) {
    return next(new ErrorResponse('القسم غير موجود', 404));
  }

  section = await Section.findByIdAndUpdate(req.params.sectionId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'تم تحديث القسم بنجاح',
    data: section,
  });
});

/**
 * @desc    حذف قسم
 * @route   DELETE /api/admin/courses/:courseId/sections/:sectionId
 * @access  Private/Admin
 */
exports.deleteSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.sectionId);

  if (!section) {
    return next(new ErrorResponse('القسم غير موجود', 404));
  }

  // حذف القسم من الدورة
  const course = await Course.findById(req.params.courseId);
  if (course) {
    course.sections = course.sections.filter(
      (s) => s.toString() !== req.params.sectionId
    );
    await course.save();
    await updateCourseStats(course._id);
  }

  await section.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف القسم بنجاح',
  });
});

/**
 * @desc    إعادة ترتيب الأقسام
 * @route   PUT /api/admin/courses/:courseId/sections/reorder
 * @access  Private/Admin
 */
exports.reorderSections = asyncHandler(async (req, res, next) => {
  const { sections } = req.body;

  if (!sections || !Array.isArray(sections)) {
    return next(new ErrorResponse('البيانات غير صحيحة', 400));
  }

  const updatePromises = sections.map((item) =>
    Section.findByIdAndUpdate(item.id, { order: item.order })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'تم إعادة ترتيب الأقسام بنجاح',
  });
});
