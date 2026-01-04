const mongoose = require('mongoose');

/**
 * QuizAttempt Schema
 * نموذج محاولات الامتحان
 */
const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'معرف المستخدم مطلوب'],
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'معرف الامتحان مطلوب'],
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'معرف الدورة مطلوب'],
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        selectedOptions: [Number],
        isCorrect: Boolean,
        pointsEarned: Number,
      },
    ],

    score: {
      type: Number,
      required: true,
    },

    totalPoints: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    passed: {
      type: Boolean,
      required: true,
    },

    attemptNumber: {
      type: Number,
      required: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    completedAt: {
      type: Date,
      required: true,
    },

    timeSpent: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index للبحث السريع
quizAttemptSchema.index({ userId: 1, quizId: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
