const express = require('express');
const router = express.Router();
const {
  getCourseReviews,
  addReview,
  updateMyReview,
  deleteMyReview,
  markHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/courses/:courseId', getCourseReviews);

// Protected routes
router.post('/courses/:courseId', protect, addReview);
router.put('/:reviewId', protect, updateMyReview);
router.delete('/:reviewId', protect, deleteMyReview);
router.post('/:reviewId/helpful', protect, markHelpful);

module.exports = router;
