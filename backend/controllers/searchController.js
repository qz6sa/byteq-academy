const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const ApiFeatures = require('../utils/apiFeatures');

/**
 * @desc    البحث عن دورات
 * @route   GET /api/search/courses
 * @access  Public
 */
exports.searchCourses = asyncHandler(async (req, res, next) => {
  let query = Course.find({ isPublished: true });

  const features = new ApiFeatures(query, req.query)
    .search()
    .filter()
    .sort()
    .paginate();

  const courses = await features.query.populate('categoryId', 'name slug');

  // عدد النتائج الكلي
  const countQuery = Course.find({ isPublished: true });
  const countFeatures = new ApiFeatures(countQuery, req.query)
    .search()
    .filter();
  const total = await Course.countDocuments(countFeatures.query.getQuery());

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    data: courses,
  });
});

/**
 * @desc    اقتراحات البحث
 * @route   GET /api/search/suggestions
 * @access  Public
 */
exports.getSuggestions = asyncHandler(async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const courses = await Course.find({
    isPublished: true,
    $or: [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ],
  })
    .select('title slug thumbnail')
    .limit(5);

  res.status(200).json({
    success: true,
    data: courses,
  });
});
