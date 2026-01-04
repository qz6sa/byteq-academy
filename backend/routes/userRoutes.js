const express = require('express');
const router = express.Router();
const {
  getMe,
  updateMe,
  uploadAvatar,
  deleteMe,
  getMyStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// حماية جميع المسارات
router.use(protect);

// Routes
router.route('/me').get(getMe).put(updateMe).delete(deleteMe);

router.post('/avatar', upload.single('avatar'), uploadAvatar);

router.get('/stats', getMyStats);

module.exports = router;
