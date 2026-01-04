const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Category Schema
 * نموذج الفئات (Python, Web, Kali, etc.)
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم الفئة مطلوب'],
      unique: true,
      trim: true,
      maxlength: [50, 'اسم الفئة طويل جداً'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      maxlength: [500, 'الوصف طويل جداً'],
    },

    icon: {
      type: String,
      default: 'default-icon',
    },

    thumbnail: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    coursesCount: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// إنشاء slug تلقائياً من الاسم
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
