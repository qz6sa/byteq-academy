const mongoose = require('mongoose');

/**
 * Question Schema
 * نموذج الأسئلة
 */
const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'معرف الامتحان مطلوب'],
    },

    questionText: {
      type: String,
      required: [true, 'نص السؤال مطلوب'],
    },

    questionType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'multiple-select'],
      required: [true, 'نوع السؤال مطلوب'],
    },

    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],

    explanation: {
      type: String,
    },

    points: {
      type: Number,
      default: 1,
      min: 1,
    },

    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: على الأقل إجابة صحيحة واحدة
questionSchema.pre('save', function (next) {
  const hasCorrectAnswer = this.options.some((option) => option.isCorrect);

  if (!hasCorrectAnswer) {
    return next(new Error('يجب أن يكون هناك إجابة صحيحة واحدة على الأقل'));
  }

  // true-false يجب أن يكون لها خيارين فقط
  if (this.questionType === 'true-false' && this.options.length !== 2) {
    return next(new Error('أسئلة صح/خطأ يجب أن تحتوي على خيارين فقط'));
  }

  next();
});

module.exports = mongoose.model('Question', questionSchema);
