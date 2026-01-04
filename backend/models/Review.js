const mongoose = require('mongoose');

/**
 * Review Schema
 * نموذج التقييمات والمراجعات
 */
const reviewSchema = new mongoose.Schema(
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

    rating: {
      type: Number,
      required: [true, 'التقييم مطلوب'],
      min: [1, 'التقييم يجب أن يكون بين 1 و 5'],
      max: [5, 'التقييم يجب أن يكون بين 1 و 5'],
    },

    comment: {
      type: String,
      required: [true, 'التعليق مطلوب'],
      minlength: [10, 'التعليق يجب أن يكون 10 أحرف على الأقل'],
      maxlength: [1000, 'التعليق طويل جداً'],
    },

    helpful: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    helpfulCount: {
      type: Number,
      default: 0,
    },

    reported: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index: مستخدم واحد يمكنه تقييم دورة واحدة مرة واحدة فقط
reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Static method لحساب متوسط التقييم
reviewSchema.statics.calculateAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { courseId: courseId, isApproved: true } },
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const Course = mongoose.model('Course');
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewsCount: stats[0].reviewsCount,
    });
  }
};

// تحديث متوسط التقييم بعد الحفظ
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.courseId);
});

// تحديث متوسط التقييم بعد الحذف
reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.courseId);
});

module.exports = mongoose.model('Review', reviewSchema);
