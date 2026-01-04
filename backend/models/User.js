const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * User Schema
 * نموذج المستخدم (طالب أو admin)
 */
const userSchema = new mongoose.Schema(
  {
    // البيانات الأساسية
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
      trim: true,
      minlength: [3, 'الاسم يجب أن يكون 3 أحرف على الأقل'],
      maxlength: [50, 'الاسم طويل جداً'],
    },

    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'البريد الإلكتروني غير صالح',
      ],
    },

    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
      select: false, // لا تُظهر في الاستعلامات
    },

    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },

    // الملف الشخصي
    profile: {
      avatar: {
        type: String,
        default: 'https://via.placeholder.com/150',
      },
      bio: {
        type: String,
        maxlength: [500, 'السيرة الذاتية طويلة جداً'],
      },
      phone: String,
      country: String,
      dateOfBirth: Date,
    },

    // الدورات المسجل بها
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // الدورات المكتملة
    completedCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // الشهادات
    certificates: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        certificateUrl: String,
        certificateId: String,
        issuedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // التحقق من البريد
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: String,

    // إعادة تعيين كلمة المرور
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // حالة المستخدم
    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ================================
// Middleware: تشفير كلمة المرور قبل الحفظ
// ================================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ================================
// Method: مقارنة كلمة المرور
// ================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ================================
// Method: إنشاء JWT Token
// ================================
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ================================
// Method: إنشاء رمز تحقق البريد
// ================================
userSchema.methods.getEmailVerificationToken = function () {
  // إنشاء رمز عشوائي
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // تشفير وحفظ الرمز
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return verificationToken;
};

// ================================
// Method: إنشاء رمز إعادة تعيين كلمة المرور
// ================================
userSchema.methods.getResetPasswordToken = function () {
  // إنشاء رمز عشوائي
  const resetToken = crypto.randomBytes(20).toString('hex');

  // تشفير وحفظ الرمز
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // تعيين وقت انتهاء الصلاحية (10 دقائق)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
