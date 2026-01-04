const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getFeaturedCourses,
  getFreeCourses,
  getCoursesByCategory,
  getCourseBySlug,
  getCoursePreview,
} = require('../controllers/courseController');

// Public routes
router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/free', getFreeCourses);
router.get('/category/:categorySlug', getCoursesByCategory);
router.get('/:slug', getCourseBySlug);
router.get('/:id/preview', getCoursePreview);

module.exports = router;
