const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    تسجيل مستخدم جديد
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // التحقق من البيانات
  if (!name || !email || !password) {
    return next(new ErrorResponse('جميع الحقول مطلوبة', 400));
  }

  // إنشاء المستخدم
  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
  });

  // إنشاء رمز تحقق البريد
  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // إرسال بريد التحقق
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'تأكيد البريد الإلكتروني - ByTeq Academy',
      message: `مرحباً ${user.name}،\n\nشكراً لتسجيلك في ByTeq Academy!\n\nيرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:\n\n${verificationUrl}\n\nإذا لم تقم بالتسجيل، يرجى تجاهل هذا البريد.`,
    });
  } catch (err) {
    console.log('خطأ في إرسال البريد:', err);
  }

  // إرسال الـ Token
  sendTokenResponse(user, 201, res, 'تم التسجيل بنجاح');
});

/**
 * @desc    تسجيل الدخول
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // التحقق من البيانات
  if (!email || !password) {
    return next(
      new ErrorResponse('البريد الإلكتروني وكلمة المرور مطلوبان', 400)
    );
  }

  // البحث عن المستخدم مع كلمة المرور
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('بيانات الدخول غير صحيحة', 401));
  }

  // التحقق من كلمة المرور
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('بيانات الدخول غير صحيحة', 401));
  }

  // التحقق من حالة المستخدم
  if (user.isBlocked) {
    return next(
      new ErrorResponse('حسابك محظور. تواصل مع الدعم الفني', 403)
    );
  }

  // إرسال الـ Token
  sendTokenResponse(user, 200, res, 'تم تسجيل الدخول بنجاح');
});

/**
 * @desc    تسجيل الخروج
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });
});

/**
 * @desc    الحصول على بيانات المستخدم الحالي
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    تأكيد البريد الإلكتروني
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorResponse('الرمز مطلوب', 400));
  }

  // تشفير الرمز للمقارنة
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // البحث عن المستخدم
  const user = await User.findOne({ emailVerificationToken });

  if (!user) {
    return next(new ErrorResponse('الرمز غير صالح', 400));
  }

  // تحديث حالة البريد
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'تم تأكيد البريد الإلكتروني بنجاح',
  });
});

/**
 * @desc    طلب إعادة تعيين كلمة المرور
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('البريد الإلكتروني مطلوب', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('لا يوجد مستخدم بهذا البريد', 404));
  }

  // إنشاء رمز إعادة التعيين
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // إنشاء رابط إعادة التعيين
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'إعادة تعيين كلمة المرور - ByTeq Academy',
      message: `مرحباً ${user.name}،\n\nلقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.\n\nيرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:\n\n${resetUrl}\n\nصلاحية الرابط: 10 دقائق\n\nإذا لم تطلب ذلك، يرجى تجاهل هذا البريد.`,
    });

    res.status(200).json({
      success: true,
      message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني',
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse('فشل إرسال البريد الإلكتروني', 500)
    );
  }
});

/**
 * @desc    إعادة تعيين كلمة المرور
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new ErrorResponse('كلمة المرور الجديدة مطلوبة', 400));
  }

  // تشفير الرمز للمقارنة
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // البحث عن المستخدم
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('الرمز غير صالح أو منتهي الصلاحية', 400));
  }

  // تعيين كلمة المرور الجديدة
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'تم تغيير كلمة المرور بنجاح',
  });
});

/**
 * @desc    تغيير كلمة المرور (للمستخدم المسجل)
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new ErrorResponse('كلمة المرور الحالية والجديدة مطلوبتان', 400)
    );
  }

  // جلب المستخدم مع كلمة المرور
  const user = await User.findById(req.user._id).select('+password');

  // التحقق من كلمة المرور الحالية
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('كلمة المرور الحالية غير صحيحة', 401));
  }

  // تحديث كلمة المرور
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'تم تغيير كلمة المرور بنجاح');
});

// ================================
// Helper Function: إرسال Token Response
// ================================
const sendTokenResponse = (user, statusCode, res, message) => {
  // إنشاء JWT token
  const token = user.getSignedJwtToken();

  // إزالة كلمة المرور من الاستجابة
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user,
  });
};
