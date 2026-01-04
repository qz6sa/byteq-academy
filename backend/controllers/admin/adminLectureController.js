const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Lecture = require('../../models/Lecture');
const Section = require('../../models/Section');
const { validateYoutubeUrl, extractVideoId } = require('../../utils/youtubeHelper');
const { updateSectionStats, updateCourseStats } = require('../../utils/calculateProgress');

/**
 * @desc    جلب جميع دروس القسم
 * @route   GET /api/admin/sections/:sectionId/lectures
 * @access  Private/Admin
 */
exports.getAllLectures = asyncHandler(async (req, res, next) => {
  const lectures = await Lecture.find({ sectionId: req.params.sectionId }).sort('order');

  res.status(200).json({
    success: true,
    count: lectures.length,
    data: lectures,
  });
});

/**
 * @desc    إضافة درس جديد
 * @route   POST /api/admin/sections/:sectionId/lectures
 * @access  Private/Admin
 */
exports.createLecture = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.sectionId);

  if (!section) {
    return next(new ErrorResponse('القسم غير موجود', 404));
  }

  // التحقق من رابط YouTube
  if (!validateYoutubeUrl(req.body.youtubeUrl)) {
    return next(new ErrorResponse('رابط YouTube غير صالح', 400));
  }

  // استخراج Video ID
  const videoId = extractVideoId(req.body.youtubeUrl);
  req.body.youtubeVideoId = videoId;

  const lecture = await Lecture.create({
    ...req.body,
    sectionId: req.params.sectionId,
    courseId: section.courseId,
  });

  // إضافة الدرس للقسم
  section.lectures.push(lecture._id);
  await section.save();

  // تحديث الإحصائيات
  await updateSectionStats(section._id);
  await updateCourseStats(section.courseId);

  res.status(201).json({
    success: true,
    message: 'تم إضافة الدرس بنجاح',
    data: lecture,
  });
});

/**
 * @desc    جلب تفاصيل درس
 * @route   GET /api/admin/sections/:sectionId/lectures/:lectureId
 * @access  Private/Admin
 */
exports.getLecture = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    data: lecture,
  });
});

/**
 * @desc    تعديل درس
 * @route   PUT /api/admin/sections/:sectionId/lectures/:lectureId
 * @access  Private/Admin
 */
exports.updateLecture = asyncHandler(async (req, res, next) => {
  let lecture = await Lecture.findById(req.params.lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  // التحقق من رابط YouTube إذا تم تغييره
  if (req.body.youtubeUrl && req.body.youtubeUrl !== lecture.youtubeUrl) {
    if (!validateYoutubeUrl(req.body.youtubeUrl)) {
      return next(new ErrorResponse('رابط YouTube غير صالح', 400));
    }
    req.body.youtubeVideoId = extractVideoId(req.body.youtubeUrl);
  }

  lecture = await Lecture.findByIdAndUpdate(req.params.lectureId, req.body, {
    new: true,
    runValidators: true,
  });

  // تحديث الإحصائيات
  const section = await Section.findById(lecture.sectionId);
  if (section) {
    await updateSectionStats(section._id);
    await updateCourseStats(section.courseId);
  }

  res.status(200).json({
    success: true,
    message: 'تم تحديث الدرس بنجاح',
    data: lecture,
  });
});

/**
 * @desc    حذف درس
 * @route   DELETE /api/admin/sections/:sectionId/lectures/:lectureId
 * @access  Private/Admin
 */
exports.deleteLecture = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  // حذف الدرس من القسم
  const section = await Section.findById(req.params.sectionId);
  if (section) {
    section.lectures = section.lectures.filter(
      (l) => l.toString() !== req.params.lectureId
    );
    await section.save();
    await updateSectionStats(section._id);
    await updateCourseStats(section.courseId);
  }

  await lecture.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الدرس بنجاح',
  });
});

/**
 * @desc    إضافة ملف للدرس
 * @route   POST /api/admin/sections/:sectionId/lectures/:lectureId/resources
 * @access  Private/Admin
 */
exports.uploadResource = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  const { name, fileUrl, fileType, fileSize } = req.body;

  if (!name || !fileUrl) {
    return next(new ErrorResponse('البيانات ناقصة', 400));
  }

  lecture.resources.push({
    name,
    fileUrl,
    fileType,
    fileSize,
  });

  await lecture.save();

  res.status(200).json({
    success: true,
    message: 'تم إضافة الملف بنجاح',
    data: lecture,
  });
});

/**
 * @desc    حذف ملف من الدرس
 * @route   DELETE /api/admin/sections/:sectionId/lectures/:lectureId/resources/:resourceId
 * @access  Private/Admin
 */
exports.deleteResource = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.lectureId);

  if (!lecture) {
    return next(new ErrorResponse('الدرس غير موجود', 404));
  }

  lecture.resources = lecture.resources.filter(
    (r) => r._id.toString() !== req.params.resourceId
  );

  await lecture.save();

  res.status(200).json({
    success: true,
    message: 'تم حذف الملف بنجاح',
  });
});

/**
 * @desc    إعادة ترتيب الدروس
 * @route   PUT /api/admin/sections/:sectionId/lectures/reorder
 * @access  Private/Admin
 */
exports.reorderLectures = asyncHandler(async (req, res, next) => {
  const { lectures } = req.body;

  if (!lectures || !Array.isArray(lectures)) {
    return next(new ErrorResponse('البيانات غير صحيحة', 400));
  }

  const updatePromises = lectures.map((item) =>
    Lecture.findByIdAndUpdate(item.id, { order: item.order })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'تم إعادة ترتيب الدروس بنجاح',
  });
});
