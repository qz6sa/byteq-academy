const ErrorResponse = require('../utils/errorResponse');

/**
 * Error Handler Middleware
 * يعالج جميع الأخطاء ويرسل استجابة موحدة
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log للـ console في development
  if (process.env.NODE_ENV === 'development') {
    console.log('❌ Error:'.red, err);
  }

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = 'المعرف غير صحيح';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} موجود مسبقاً`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token غير صالح';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'انتهت صلاحية الـ Token';
    error = new ErrorResponse(message, 401);
  }

  // Response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
