const express = require('express');
const router = express.Router();
const {
  uploadImage,
  deleteImage,
} = require('../../controllers/admin/adminUploadController');
const { protect, authorize } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

// حماية جميع المسارات
router.use(protect);
router.use(authorize('admin'));

// Routes
router.post('/image', upload.single('image'), uploadImage);
router.delete('/image', deleteImage);

module.exports = router;
