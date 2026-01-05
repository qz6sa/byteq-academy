const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

/**
 * @desc    جلب بياناتي
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses.courseId', 'title thumbnail')
    .populate('completedCourses.courseId', 'title thumbnail')
    .populate('certificates');

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    تحديث بياناتي
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateMe = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    'profile.bio': req.body.bio,
    'profile.phone': req.body.phone,
  };

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'تم تحديث البيانات بنجاح',
    data: user,
  });
});

/**
 * @desc    رفع الصورة الشخصية
 * @route   POST /api/users/avatar
 * @access  Private
 */
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('الرجاء اختيار صورة', 400));
  }

  const user = await User.findById(req.user._id);

  try {
    // حذف الصورة القديمة من Cloudinary
    if (user.profile.avatar && user.profile.avatar.includes('cloudinary')) {
      const urlParts = user.profile.avatar.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExt.split('.')[0];
      const folderPath = urlParts.slice(7, -1).join('/');
      await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
    }

    // رفع الصورة الجديدة
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'byteq-academy/avatars',
      width: 200,
      height: 200,
      crop: 'fill',
    });

    user.profile.avatar = result.secure_url;
    await user.save();

    // حذف الملف المحلي بعد الرفع
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      data: { avatar: result.secure_url },
    });
  } catch (error) {
    // حذف الملف المحلي في حالة فشل الرفع
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return next(new ErrorResponse('فشل رفع الصورة', 500));
  }
});

/**
 * @desc    حذف حسابي
 * @route   DELETE /api/users/me
 * @access  Private
 */
exports.deleteMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // حذف الصورة من Cloudinary
  if (user.profile.avatar && user.profile.avatar.includes('cloudinary')) {
    try {
      const urlParts = user.profile.avatar.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExt.split('.')[0];
      const folderPath = urlParts.slice(7, -1).join('/');
      await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
    } catch (error) {
      console.error('خطأ في حذف الصورة:', error);
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الحساب بنجاح',
  });
});

/**
 * @desc    جلب إحصائياتي
 * @route   GET /api/users/stats
 * @access  Private
 */
exports.getMyStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const stats = {
    enrolledCoursesCount: user.enrolledCourses.length,
    completedCoursesCount: user.completedCourses.length,
    certificatesCount: user.certificates.length,
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});
