const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const cloudinary = require('../../config/cloudinary');

/**
 * @desc    رفع صورة (Admin)
 * @route   POST /api/admin/upload/image
 * @access  Private/Admin
 */
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('الرجاء اختيار صورة', 400));
  }

  const { folder } = req.body;

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: folder || 'general',
  });

  res.status(200).json({
    success: true,
    message: 'تم رفع الصورة بنجاح',
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});

/**
 * @desc    حذف صورة (Admin)
 * @route   DELETE /api/admin/upload/image
 * @access  Private/Admin
 */
exports.deleteImage = asyncHandler(async (req, res, next) => {
  const { publicId } = req.body;

  if (!publicId) {
    return next(new ErrorResponse('معرّف الصورة مطلوب', 400));
  }

  await cloudinary.uploader.destroy(publicId);

  res.status(200).json({
    success: true,
    message: 'تم حذف الصورة بنجاح',
  });
});
