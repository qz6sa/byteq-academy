# 🎓 ByTeq Academy - Backend API

## 📖 نظرة عامة

Backend API متكامل لأكاديمية ByTeq Academy للأمن السيبراني، مبني باستخدام **Node.js** و **Express** و **MongoDB**.

### ✨ المميزات الرئيسية

- 🔐 نظام مصادقة كامل (JWT + Email Verification)
- 👨‍💼 Dashboard شامل للـ Admin
- 📚 إدارة الدورات والأقسام والدروس
- 🎥 دعم فيديوهات YouTube
- 📝 نظام امتحانات متقدم (Multiple Choice, True/False, Multiple Select)
- 📊 تتبع تقدم الطلاب
- ⭐ نظام التقييمات والمراجعات
- 🎖️ إصدار شهادات PDF تلقائياً
- 🔍 بحث وفلترة متقدمة
- 📷 رفع الصور عبر Cloudinary
- 🛡️ حماية شاملة (Helmet, Rate Limiting, XSS Protection)

---

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js (v16 أو أحدث)
- MongoDB (محلي أو Atlas)
- حساب Cloudinary (للصور)
- حساب Gmail (للبريد الإلكتروني)

### التثبيت

1. **استنساخ المشروع**
```bash
cd backend
```

2. **تثبيت الـ Dependencies**
```bash
npm install
```

3. **إعداد ملف .env**
```bash
cp .env.example .env
```

4. **تعديل متغيرات البيئة في .env**

5. **إضافة البيانات الأولية (الفئات + Admin)**
```bash
npm run seed
```

6. **تشغيل السيرفر**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

السيرفر سيعمل على: `http://localhost:5000`

---

## 📁 هيكل المشروع

```
backend/
├── config/
│   ├── db.js                   # اتصال MongoDB
│   └── cloudinary.js           # إعداد Cloudinary
│
├── controllers/
│   ├── authController.js       # المصادقة
│   ├── userController.js       # المستخدمين
│   ├── categoryController.js   # الفئات
│   ├── courseController.js     # الدورات
│   ├── enrollmentController.js # التسجيل
│   ├── quizController.js       # الامتحانات
│   ├── reviewController.js     # التقييمات
│   ├── certificateController.js # الشهادات
│   └── admin/                  # Admin Controllers
│
├── models/
│   ├── User.js                 # المستخدم
│   ├── Category.js             # الفئة
│   ├── Course.js               # الدورة
│   ├── Section.js              # القسم
│   ├── Lecture.js              # الدرس
│   ├── Quiz.js                 # الامتحان
│   ├── Question.js             # السؤال
│   ├── QuizAttempt.js          # محاولة الامتحان
│   ├── Enrollment.js           # التسجيل
│   ├── Review.js               # التقييم
│   └── Certificate.js          # الشهادة
│
├── routes/
│   ├── authRoutes.js           # مسارات المصادقة
│   └── ...                     # بقية المسارات
│
├── middleware/
│   ├── authMiddleware.js       # حماية المسارات
│   ├── errorHandler.js         # معالجة الأخطاء
│   ├── uploadMiddleware.js     # رفع الملفات
│   └── enrollmentMiddleware.js # التحقق من التسجيل
│
├── utils/
│   ├── sendEmail.js            # إرسال البريد
│   ├── apiFeatures.js          # البحث والفلترة
│   ├── youtubeHelper.js        # YouTube Utilities
│   ├── calculateProgress.js    # حساب التقدم
│   ├── generateCertificate.js  # إنشاء الشهادات
│   ├── errorResponse.js        # Custom Error
│   ├── asyncHandler.js         # Async Wrapper
│   └── seeder.js               # البيانات الأولية
│
├── .env                        # المتغيرات البيئية
├── .env.example                # مثال للمتغيرات
├── .gitignore
├── package.json
├── server.js                   # نقطة البداية
└── README.md
```

---

## 🔑 بيانات الدخول الافتراضية

بعد تشغيل `npm run seed`:

**Admin Account:**
- Email: `admin@byteqacademy.com`
- Password: `admin123456`

---

## 📚 الفئات الأساسية (5 فئات)

1. **Python Programming** - تعلم لغة البايثون
2. **Web Fundamentals** - HTML, CSS, JavaScript
3. **Python for Cybersecurity** - البايثون في الأمن السيبراني
4. **Kali Linux Fundamentals** - أساسيات كالي لينكس
5. **Penetration Testing** - اختبار الاختراق

---

## 🔗 API Routes

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | تسجيل مستخدم جديد | Public |
| POST | `/api/auth/login` | تسجيل الدخول | Public |
| GET | `/api/auth/logout` | تسجيل الخروج | Private |
| GET | `/api/auth/me` | بيانات المستخدم الحالي | Private |
| POST | `/api/auth/verify-email` | تأكيد البريد | Public |
| POST | `/api/auth/forgot-password` | نسيت كلمة المرور | Public |
| PUT | `/api/auth/reset-password/:token` | إعادة تعيين كلمة المرور | Public |
| PUT | `/api/auth/update-password` | تغيير كلمة المرور | Private |

### User Routes
(سيتم إضافة بقية المسارات تدريجياً)

---

## 🛠️ Technologies المستخدمة

### Backend Framework
- **Express.js** - إطار عمل الـ API

### Database
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM

### Authentication & Security
- **JWT** - JSON Web Tokens
- **bcryptjs** - تشفير كلمات المرور
- **Helmet** - HTTP headers security
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - NoSQL injection prevention
- **xss-clean** - XSS protection
- **CORS** - Cross-Origin Resource Sharing

### File Management
- **Multer** - رفع الملفات
- **Cloudinary** - تخزين الصور

### PDF & QR
- **PDFKit** - إنشاء PDF
- **QRCode** - إنشاء QR Codes

### Email
- **Nodemailer** - إرسال البريد

### Validation
- **express-validator** - التحقق من المدخلات
- **Validator** - String validation

### Utilities
- **Slugify** - إنشاء URL-friendly strings
- **UUID** - معرفات فريدة
- **Colors** - Console colors

---

## 🔒 الأمان

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Rate Limiting (100 req/15min)
- ✅ NoSQL Injection Protection
- ✅ XSS Protection
- ✅ Helmet Security Headers
- ✅ CORS Configuration
- ✅ Input Validation

---

## 📧 إعداد البريد الإلكتروني (Gmail)

1. اذهب إلى Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password
4. ضع App Password في `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## ☁️ إعداد Cloudinary

1. إنشاء حساب على [Cloudinary](https://cloudinary.com/)
2. احصل على Cloud Name, API Key, API Secret
3. ضعها في `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📝 Scripts متاحة

```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm start

# إضافة البيانات الأولية
npm run seed

# حذف جميع البيانات
npm run seed -d
```

---

## 🌐 Environment Variables

ملف `.env` يحتوي على:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/byteq-academy
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

---

## 🐛 استكشاف الأخطاء

### MongoDB Connection Error
- تأكد من تشغيل MongoDB
- تحقق من `MONGO_URI` في `.env`

### Cloudinary Upload Error
- تحقق من صحة API credentials
- تأكد من اتصال الإنترنت

### Email Sending Error
- تأكد من تفعيل 2FA في Gmail
- استخدم App Password وليس كلمة المرور العادية

---

## 📮 الدعم والمساعدة

للأسئلة والدعم:
- Email: support@byteqacademy.com
- GitHub Issues: [Create Issue](#)

---

## 📄 License

MIT License - يمكن استخدام المشروع بحرية

---

## 👨‍💻 المطور

**qz6sa**
- GitHub: [@qz6sa](#)

---

## 🎯 الخطوات التالية

المشروع جاهز لاستكمال:
1. ✅ إنشاء بقية Controllers
2. ✅ إنشاء جميع Routes
3. ✅ إنشاء Validators
4. ✅ اختبار شامل
5. ✅ Documentation كاملة
6. ✅ Deploy على السيرفر

---

**🚀 ByTeq Academy - Learn Cybersecurity**

*Built with ❤️ using Node.js, Express & MongoDB*
