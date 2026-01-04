const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Category = require('../models/Category');

/**
 * @desc    جلب جميع الفئات النشطة
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).sort('order');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

/**
 * @desc    جلب فئة محددة بالـ slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
exports.getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});
