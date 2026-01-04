/**
 * Async Handler Wrapper
 * يلف async functions لتجنب try-catch المتكررة
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
