const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  toggleBlockUser,
} = require('../../controllers/admin/adminUserController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getUser).put(updateUser).delete(deleteUser);

router.put('/:userId/change-role', changeUserRole);
router.put('/:userId/toggle-block', toggleBlockUser);

module.exports = router;
