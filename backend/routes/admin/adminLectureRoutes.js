const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllLectures,
  createLecture,
  getLecture,
  updateLecture,
  deleteLecture,
  uploadResource,
  deleteResource,
  reorderLectures,
} = require('../../controllers/admin/adminLectureController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات - Admin فقط
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllLectures).post(createLecture);

router.put('/reorder', reorderLectures);

router
  .route('/:lectureId')
  .get(getLecture)
  .put(updateLecture)
  .delete(deleteLecture);

router.post('/:lectureId/resources', uploadResource);
router.delete('/:lectureId/resources/:resourceId', deleteResource);

module.exports = router;
