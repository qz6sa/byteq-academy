const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentDetails,
  completeLecture,
  updateLectureProgress,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);

// Routes
router.post('/courses/:courseId/enroll', enrollInCourse);
router.get('/my-enrollments', getMyEnrollments);
router.get('/courses/:courseId', getEnrollmentDetails);
router.post('/lectures/:lectureId/complete', completeLecture);
router.put('/lectures/:lectureId/progress', updateLectureProgress);

module.exports = router;
