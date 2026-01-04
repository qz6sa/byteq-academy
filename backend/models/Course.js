const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Course Schema
 * نموذج الدورات التدريبية
 */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان الدورة مطلوب'],
      trim: true,
      maxlength: [200, 'العنوان طويل جداً'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      required: [true, 'الوصف القصير مطلوب'],
      maxlength: [160, 'الوصف القصير يجب ألا يتجاوز 160 حرف'],
    },

    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'الفئة مطلوبة'],
    },

    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: [true, 'المستوى مطلوب'],
    },

    language: {
      type: String,
      enum: ['arabic', 'english'],
      required: [true, 'اللغة مطلوبة'],
    },

    price: {
      type: Number,
      required: [true, 'السعر مطلوب'],
      default: 0,
    },

    discountPrice: {
      type: Number,
    },

    thumbnail: {
      type: String,
      required: [true, 'صورة الدورة مطلوبة'],
    },

    previewVideoUrl: {
      type: String,
    },

    requirements: [
      {
        type: String,
      },
    ],

    whatYouWillLearn: [
      {
        type: String,
      },
    ],

    targetAudience: [
      {
        type: String,
      },
    ],

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

    totalSections: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// إنشاء slug تلقائياً
courseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    // محاولة إنشاء slug من العنوان
    let generatedSlug = slugify(this.title, { 
      lower: true, 
      strict: false,
      locale: 'ar',
      replacement: '-'
    });
    
    // إذا كان الـ slug فارغ أو قصير جداً (العربي لا يعمل)، استخدم ID + timestamp
    if (!generatedSlug || generatedSlug.length < 3 || generatedSlug === '-') {
      // استخدم أول 3 كلمات من العنوان مع timestamp
      const words = this.title.split(' ').slice(0, 3).join('-');
      const timestamp = Date.now().toString().slice(-6);
      this.slug = `course-${timestamp}`;
    } else {
      this.slug = generatedSlug;
    }
  }
  next();
});

// Virtual للتحقق من السعر المخفض
courseSchema.virtual('finalPrice').get(function () {
  return this.discountPrice || this.price;
});

// Virtual للتحقق من الدورة المجانية
courseSchema.pre('save', function (next) {
  this.isFree = this.price === 0;
  next();
});

module.exports = mongoose.model('Course', courseSchema);
