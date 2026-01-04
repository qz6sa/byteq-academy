const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsersStats,
  getCoursesStats,
  getEnrollmentsStats,
} = require('../../controllers/admin/adminDashboardController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/stats', getDashboardStats);
router.get('/users-stats', getUsersStats);
router.get('/courses-stats', getCoursesStats);
router.get('/enrollments-stats', getEnrollmentsStats);

module.exports = router;
