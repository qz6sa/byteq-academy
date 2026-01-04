const mongoose = require('mongoose');

/**
 * Section Schema
 * نموذج الأقسام داخل الدورة
 */
const sectionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'معرف الدورة مطلوب'],
    },

    title: {
      type: String,
      required: [true, 'عنوان القسم مطلوب'],
      trim: true,
    },

    description: {
      type: String,
    },

    order: {
      type: Number,
      required: [true, 'ترتيب القسم مطلوب'],
    },

    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],

    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],

    totalDuration: {
      type: Number,
      default: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Section', sectionSchema);
