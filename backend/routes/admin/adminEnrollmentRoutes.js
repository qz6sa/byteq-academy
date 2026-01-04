const express = require('express');
const router = express.Router();
const {
  getAllEnrollments,
  getEnrollment,
  deleteEnrollment,
} = require('../../controllers/admin/adminEnrollmentController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', getAllEnrollments);
router.route('/:enrollmentId').get(getEnrollment).delete(deleteEnrollment);

module.exports = router;
