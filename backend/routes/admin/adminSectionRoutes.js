const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllSections,
  createSection,
  getSection,
  updateSection,
  deleteSection,
  reorderSections,
} = require('../../controllers/admin/adminSectionController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات - Admin فقط
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllSections).post(createSection);

router.put('/reorder', reorderSections);

router
  .route('/:sectionId')
  .get(getSection)
  .put(updateSection)
  .delete(deleteSection);

module.exports = router;
