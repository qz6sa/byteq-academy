const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Certificate Schema
 * نموذج الشهادات
 */
const certificateSchema = new mongoose.Schema(
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

    certificateId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },

    studentName: {
      type: String,
      required: [true, 'اسم الطالب مطلوب'],
    },

    courseName: {
      type: String,
      required: [true, 'اسم الدورة مطلوب'],
    },

    completionDate: {
      type: Date,
      required: [true, 'تاريخ الإكمال مطلوب'],
    },

    certificateUrl: {
      type: String,
    },

    verificationUrl: {
      type: String,
    },

    qrCodeUrl: {
      type: String,
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index للبحث السريع
certificateSchema.index({ userId: 1, courseId: 1 });
certificateSchema.index({ certificateId: 1 });

// إنشاء verification URL تلقائياً
certificateSchema.pre('save', function (next) {
  if (this.isNew) {
    this.verificationUrl = `${process.env.CERTIFICATE_BASE_URL}/${this.certificateId}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
