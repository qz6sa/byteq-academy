const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  approveReview,
  deleteReview,
} = require('../../controllers/admin/adminReviewController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', getAllReviews);
router.put('/:reviewId/approve', approveReview);
router.delete('/:reviewId', deleteReview);

module.exports = router;
