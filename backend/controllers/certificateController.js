const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { generateCertificatePDF } = require('../utils/generateCertificate');
const { canIssueCertificate } = require('../utils/calculateProgress');

/**
 * @desc    جلب شهاداتي
 * @route   GET /api/certificates/my-certificates
 * @access  Private
 */
exports.getMyCertificates = asyncHandler(async (req, res, next) => {
  const certificates = await Certificate.find({ userId: req.user._id })
    .populate('courseId', 'title thumbnail')
    .sort('-issuedAt');

  res.status(200).json({
    success: true,
    count: certificates.length,
    data: certificates,
  });
});

/**
 * @desc    إصدار شهادة
 * @route   POST /api/certificates/courses/:courseId/generate
 * @access  Private
 */
exports.generateCertificate = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse('الدورة غير موجودة', 404));
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: courseId,
  });

  if (!enrollment) {
    return next(new ErrorResponse('لم تسجل في هذه الدورة', 403));
  }

  // التحقق من الإكمال
  const eligible = await canIssueCertificate(enrollment._id);
  if (!eligible) {
    return next(new ErrorResponse('يجب إكمال الدورة بالكامل أولاً', 400));
  }

  // التحقق من الشهادة المسبقة
  const existingCertificate = await Certificate.findOne({
    userId: req.user._id,
    courseId: courseId,
  });

  if (existingCertificate) {
    return res.status(200).json({
      success: true,
      message: 'الشهادة موجودة مسبقاً',
      data: existingCertificate,
    });
  }

  // إنشاء الشهادة
  const certificateData = await generateCertificatePDF({
    studentName: req.user.name,
    courseName: course.title,
    completionDate: new Date(),
  });

  const certificate = await Certificate.create({
    userId: req.user._id,
    courseId: courseId,
    certificateUrl: certificateData.certificateUrl,
  });

  // تحديث المستخدم
  const user = await User.findById(req.user._id);
  user.certificates.push(certificate._id);
  user.completedCourses.push({
    courseId: courseId,
    completedAt: Date.now(),
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: 'تم إصدار الشهادة بنجاح',
    data: certificate,
  });
});

/**
 * @desc    التحقق من شهادة
 * @route   GET /api/certificates/verify/:certificateId
 * @access  Public
 */
exports.verifyCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findOne({
    certificateId: req.params.certificateId,
  })
    .populate('userId', 'name profile.avatar')
    .populate('courseId', 'title');

  if (!certificate) {
    return next(new ErrorResponse('الشهادة غير موجودة', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      valid: true,
      studentName: certificate.userId.name,
      courseName: certificate.courseId.title,
      issuedAt: certificate.issuedAt,
      certificateId: certificate.certificateId,
    },
  });
});

/**
 * @desc    تحميل شهادة
 * @route   GET /api/certificates/:certificateId/download
 * @access  Private
 */
exports.downloadCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.certificateId);

  if (!certificate) {
    return next(new ErrorResponse('الشهادة غير موجودة', 404));
  }

  if (certificate.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('غير مصرح لك', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      certificateUrl: certificate.certificateUrl,
    },
  });
});
