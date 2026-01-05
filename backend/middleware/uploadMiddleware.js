const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Multer Configuration
 * للتعامل مع رفع الملفات (صور فقط)
 */

// إنشاء مجلد uploads إذا لم يكن موجوداً
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تخزين في المجلد المحلي مؤقتاً
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// فلترة أنواع الملفات - صور فقط
const fileFilter = (req, file, cb) => {
  // الأنواع المسموحة
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('يُسمح بالصور فقط (JPG, JPEG, PNG, GIF, WEBP)', 400));
  }
};

// إعدادات Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },
  fileFilter: fileFilter,
});

// Export upload directly
module.exports = upload;
