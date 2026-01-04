const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllQuizzes,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  toggleActive,
} = require('../../controllers/admin/adminQuizController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// حماية جميع المسارات
router.use(protect);
router.use(authorize('admin'));

// Routes
router.route('/').get(getAllQuizzes).post(createQuiz);

router.route('/:quizId').get(getQuiz).put(updateQuiz).delete(deleteQuiz);

router.put('/:quizId/toggle-active', toggleActive);

module.exports = router;
