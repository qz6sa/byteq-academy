const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

/**
 * Protect Routes Middleware
 * يحمي المسارات ويتحقق من JWT token
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // استخراج الـ token من header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // التحقق من وجود token
  if (!token) {
    return next(
      new ErrorResponse('غير مصرح لك بالوصول إلى هذا المسار', 401)
    );
  }

  try {
    // التحقق من صحة الـ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // جلب المستخدم من قاعدة البيانات
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(new ErrorResponse('المستخدم غير موجود', 404));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Token غير صالح', 401));
  }
});

/**
 * Authorize Specific Roles
 * يسمح فقط لأدوار محددة
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `الدور ${req.user.role} غير مصرح له بالوصول إلى هذا المسار`,
          403
        )
      );
    }
    next();
  };
};
