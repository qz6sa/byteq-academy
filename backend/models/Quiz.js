const mongoose = require('mongoose');

/**
 * Quiz Schema
 * نموذج الامتحانات
 */
const quizSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'معرف القسم مطلوب'],
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'معرف الدورة مطلوب'],
    },

    title: {
      type: String,
      required: [true, 'عنوان الامتحان مطلوب'],
      trim: true,
    },

    description: {
      type: String,
    },

    passingScore: {
      type: Number,
      required: [true, 'درجة النجاح مطلوبة'],
      default: 70,
      min: 0,
      max: 100,
    },

    timeLimit: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      required: [true, 'ترتيب الامتحان مطلوب'],
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],

    attemptsAllowed: {
      type: Number,
      default: 3,
    },

    shuffleQuestions: {
      type: Boolean,
      default: false,
    },

    showAnswersAfterSubmit: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
