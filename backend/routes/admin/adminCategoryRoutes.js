const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  reorderCategories,
} = require('../../controllers/admin/adminCategoryController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات - Admin فقط
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllCategories).post(createCategory);

router.put('/reorder', reorderCategories);

router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

router.put('/:id/toggle-status', toggleCategoryStatus);

module.exports = router;
