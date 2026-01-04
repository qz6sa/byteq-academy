const mongoose = require('mongoose');

/**
 * Enrollment Schema
 * نموذج التسجيل في الدورات وتتبع التقدم
 */
const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'معرف المستخدم مطلوب'],
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'معرف الدورة مطلوب'],
    },

    progress: [
      {
        lectureId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lecture',
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
        lastWatchedAt: Date,
        watchTime: {
          type: Number,
          default: 0,
        },
      },
    ],

    quizResults: [
      {
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Quiz',
        },
        bestScore: Number,
        bestAttemptId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'QuizAttempt',
        },
        totalAttempts: {
          type: Number,
          default: 0,
        },
        lastAttemptAt: Date,
        passed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completedLectures: {
      type: Number,
      default: 0,
    },

    completedQuizzes: {
      type: Number,
      default: 0,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    certificateIssuedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index للبحث السريع
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Method لحساب نسبة الإنجاز
enrollmentSchema.methods.calculateProgress = function (totalLectures) {
  if (totalLectures === 0) return 0;
  return Math.round((this.completedLectures / totalLectures) * 100);
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
