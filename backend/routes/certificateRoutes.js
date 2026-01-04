const express = require('express');
const router = express.Router();
const {
  getMyCertificates,
  generateCertificate,
  verifyCertificate,
  downloadCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes
router.get('/my-certificates', protect, getMyCertificates);
router.post('/courses/:courseId/generate', protect, generateCertificate);
router.get('/:certificateId/download', protect, downloadCertificate);

module.exports = router;
