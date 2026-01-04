const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  toggleFeatured,
  updateThumbnail,
} = require('../../controllers/admin/adminCourseController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات - Admin فقط
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllCourses).post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

router.post('/:id/publish', publishCourse);
router.post('/:id/unpublish', unpublishCourse);
router.put('/:id/featured', toggleFeatured);
router.post('/:id/thumbnail', updateThumbnail);

module.exports = router;
