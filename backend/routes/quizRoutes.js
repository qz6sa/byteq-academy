const express = require('express');
const router = express.Router();
const {
  getCourseQuizzes,
  getQuiz,
  startQuizAttempt,
  submitQuiz,
  getMyAttempts,
  getAttemptResult,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);

// Routes
router.get('/courses/:courseId', getCourseQuizzes);
router.get('/:quizId', getQuiz);
router.post('/:quizId/start', startQuizAttempt);
router.post('/:quizId/submit', submitQuiz);
router.get('/:quizId/my-attempts', getMyAttempts);
router.get('/attempts/:attemptId', getAttemptResult);

module.exports = router;
