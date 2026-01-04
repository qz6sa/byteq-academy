const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const User = require('../../models/User');

/**
 * @desc    جلب جميع المستخدمين (Admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    جلب مستخدم (Admin)
 * @route   GET /api/admin/users/:userId
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .populate('enrolledCourses.courseId', 'title')
    .populate('completedCourses.courseId', 'title')
    .populate('certificates');

  if (!user) {
    return next(new ErrorResponse('المستخدم غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    إنشاء مستخدم (Admin)
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: 'تم إنشاء المستخدم بنجاح',
    data: user,
  });
});

/**
 * @desc    تحديث مستخدم (Admin)
 * @route   PUT /api/admin/users/:userId
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ErrorResponse('المستخدم غير موجود', 404));
  }

  user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'تم تحديث المستخدم بنجاح',
    data: user,
  });
});

/**
 * @desc    حذف مستخدم (Admin)
 * @route   DELETE /api/admin/users/:userId
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ErrorResponse('المستخدم غير موجود', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف المستخدم بنجاح',
  });
});

/**
 * @desc    تغيير دور مستخدم (Admin)
 * @route   PUT /api/admin/users/:userId/change-role
 * @access  Private/Admin
 */
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ErrorResponse('المستخدم غير موجود', 404));
  }

  if (!['user', 'admin'].includes(role)) {
    return next(new ErrorResponse('دور غير صالح', 400));
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'تم تغيير الدور بنجاح',
    data: user,
  });
});

/**
 * @desc    حظر/إلغاء حظر مستخدم (Admin)
 * @route   PUT /api/admin/users/:userId/toggle-block
 * @access  Private/Admin
 */
exports.toggleBlockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ErrorResponse('المستخدم غير موجود', 404));
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: user.isBlocked ? 'تم حظر المستخدم' : 'تم إلغاء حظر المستخدم',
    data: user,
  });
});
