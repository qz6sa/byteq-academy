const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Category = require('../../models/Category');
const Course = require('../../models/Course');

/**
 * @desc    جلب جميع الفئات (مع غير النشطة)
 * @route   GET /api/admin/categories
 * @access  Private/Admin
 */
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('order');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

/**
 * @desc    إضافة فئة جديدة
 * @route   POST /api/admin/categories
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, icon, thumbnail, order } = req.body;

  // التحقق من عدم وجود فئة بنفس الاسم
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return next(new ErrorResponse('الفئة موجودة مسبقاً', 400));
  }

  const category = await Category.create({
    name,
    description,
    icon,
    thumbnail,
    order: order || 0,
  });

  res.status(201).json({
    success: true,
    message: 'تم إضافة الفئة بنجاح',
    data: category,
  });
});

/**
 * @desc    جلب فئة محددة
 * @route   GET /api/admin/categories/:id
 * @access  Private/Admin
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    تعديل فئة
 * @route   PUT /api/admin/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'تم تحديث الفئة بنجاح',
    data: category,
  });
});

/**
 * @desc    حذف فئة
 * @route   DELETE /api/admin/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  // التحقق من عدم وجود دورات في هذه الفئة
  const coursesCount = await Course.countDocuments({
    category: req.params.id,
  });

  if (coursesCount > 0) {
    return next(
      new ErrorResponse(
        'لا يمكن حذف الفئة. يوجد دورات مرتبطة بها',
        400
      )
    );
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الفئة بنجاح',
  });
});

/**
 * @desc    تفعيل/إيقاف فئة
 * @route   PUT /api/admin/categories/:id/toggle-status
 * @access  Private/Admin
 */
exports.toggleCategoryStatus = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('الفئة غير موجودة', 404));
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    message: `تم ${category.isActive ? 'تفعيل' : 'إيقاف'} الفئة بنجاح`,
    data: category,
  });
});

/**
 * @desc    إعادة ترتيب الفئات
 * @route   PUT /api/admin/categories/reorder
 * @access  Private/Admin
 */
exports.reorderCategories = asyncHandler(async (req, res, next) => {
  const { categories } = req.body;

  if (!categories || !Array.isArray(categories)) {
    return next(new ErrorResponse('البيانات غير صحيحة', 400));
  }

  // تحديث ترتيب كل فئة
  const updatePromises = categories.map((item) =>
    Category.findByIdAndUpdate(item.id, { order: item.order })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'تم إعادة ترتيب الفئات بنجاح',
  });
});
