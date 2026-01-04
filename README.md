# 🎓 ByTeq Academy - أكاديمية الأمن السيبراني

منصة تعليمية احترافية متخصصة في الأمن السيبراني والبرمجة، مبنية باستخدام MERN Stack (MongoDB, Express, React, Node.js)

## 🚀 المميزات

### Backend (100% مكتمل ✅)
- ✅ نظام مصادقة كامل (JWT + bcrypt)
- ✅ إدارة الدورات والتصنيفات
- ✅ نظام التسجيل في الدورات وتتبع التقدم
- ✅ الاختبارات مع التصحيح التلقائي
- ✅ المراجعات والتقييمات
- ✅ نظام الشهادات مع PDF + QR Code
- ✅ لوحة تحكم المدير الكاملة
- ✅ رفع الملفات إلى Cloudinary
- ✅ البحث والفلترة المتقدمة
- ✅ حماية متقدمة (Rate Limiting, Helmet, XSS, NoSQL Injection)

### Frontend (30% مكتمل 🔄)
- ✅ مشروع React + Vite + Tailwind CSS
- ✅ تصميم Glassmorphism مع Dark Theme
- ✅ نظام المصادقة (AuthContext)
- ✅ مكونات مشتركة (Button, Input, Card, Navbar, Footer, Modal, Loader)
- ✅ Layouts (MainLayout, AdminLayout)
- ✅ صفحة الرئيسية الكاملة (Hero, Stats, Categories, FeaturedCourses)
- ✅ صفحات تسجيل الدخول والتسجيل
- ✅ API Client مع Axios
- 🔄 صفحات الدورات والتفاصيل (قيد الإنشاء)
- 🔄 صفحة التعلم مع Video Player (قيد الإنشاء)
- 🔄 لوحة تحكم المدير (قيد الإنشاء)

## 📁 هيكل المشروع

```
ByTeq Academy/
├── backend/                    # Backend API (Node.js + Express)
│   ├── config/                 # إعدادات قاعدة البيانات
│   ├── controllers/            # 19 Controller
│   ├── models/                 # 11 Model (Mongoose)
│   ├── routes/                 # 19 Route
│   ├── middleware/             # المصادقة والأمان
│   ├── utils/                  # أدوات مساعدة
│   ├── docs/                   # التوثيق
│   └── server.js               # الخادم الرئيسي
│
└── frontend/                   # Frontend (React + Vite)
    ├── src/
    │   ├── api/                # Axios Configuration
    │   ├── components/         # React Components
    │   │   ├── common/         # مكونات مشتركة
    │   │   ├── home/           # مكونات الصفحة الرئيسية
    │   │   ├── courses/        # مكونات الدورات
    │   │   ├── learning/       # مكونات التعلم
    │   │   └── admin/          # مكونات لوحة التحكم
    │   ├── pages/              # الصفحات الرئيسية
    │   ├── layouts/            # التخطيطات
    │   ├── context/            # React Context (Auth)
    │   ├── hooks/              # Custom Hooks
    │   ├── utils/              # أدوات مساعدة
    │   ├── App.jsx             # التطبيق الرئيسي
    │   └── main.jsx            # نقطة الدخول
    └── public/                 # الملفات العامة
```

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** v20+
- **Express.js** v4.18
- **MongoDB** v8.2 + Mongoose
- **JWT** للمصادقة
- **Bcrypt** لتشفير كلمات المرور
- **Cloudinary** لرفع الصور
- **Nodemailer** للإشعارات
- **QRCode** للشهادات
- **PDFKit** لإنشاء ملفات PDF

### Frontend
- **React** v18
- **Vite** v7.3
- **Tailwind CSS** v3
- **Framer Motion** للرسوم المتحركة
- **React Router** v6
- **Axios** للطلبات
- **React Hot Toast** للإشعارات
- **React Icons**
- **React Player** لتشغيل الفيديو

## 🚀 التثبيت والتشغيل

### متطلبات التشغيل
- Node.js v20 أو أحدث
- MongoDB Server v8 أو أحدث
- npm أو yarn

### 1. Backend Setup

```powershell
# الانتقال إلى مجلد Backend
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
# انسخ من .env.example وقم بتعديل القيم

# ملء قاعدة البيانات ببيانات تجريبية
node seeder.js -i

# تشغيل الخادم (Development)
npm run dev

# أو تشغيل الخادم (Production)
npm start
```

الخادم سيعمل على: `http://localhost:5000`

### 2. Frontend Setup

```powershell
# الانتقال إلى مجلد Frontend
cd frontend

# تثبيت المكتبات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء للإنتاج
npm run build
```

الموقع سيعمل على: `http://localhost:5173`

## 🔐 بيانات الدخول التجريبية

### حساب المدير
- **البريد الإلكتروني:** admin@byteqacademy.com
- **كلمة المرور:** admin123456

### حساب طالب (بعد التسجيل)
- يمكنك إنشاء حساب جديد من صفحة التسجيل

## 📚 API Endpoints (120+ Endpoint)

### Authentication
```
POST   /api/auth/register       # تسجيل مستخدم جديد
POST   /api/auth/login          # تسجيل الدخول
POST   /api/auth/logout         # تسجيل الخروج
GET    /api/auth/me             # الحصول على بيانات المستخدم الحالي
PUT    /api/auth/updatedetails  # تحديث البيانات
PUT    /api/auth/updatepassword # تغيير كلمة المرور
```

### Categories
```
GET    /api/categories          # جميع التصنيفات
GET    /api/categories/:id      # تصنيف واحد
POST   /api/categories          # إنشاء تصنيف (Admin)
PUT    /api/categories/:id      # تحديث تصنيف (Admin)
DELETE /api/categories/:id      # حذف تصنيف (Admin)
```

### Courses
```
GET    /api/courses             # جميع الدورات (مع الفلترة)
GET    /api/courses/:slug       # دورة واحدة
POST   /api/courses             # إنشاء دورة (Admin)
PUT    /api/courses/:id         # تحديث دورة (Admin)
DELETE /api/courses/:id         # حذف دورة (Admin)
POST   /api/courses/:id/sections # إضافة قسم
PUT    /api/courses/sections/:sectionId # تحديث قسم
DELETE /api/courses/sections/:sectionId # حذف قسم
POST   /api/courses/sections/:sectionId/lectures # إضافة محاضرة
PUT    /api/courses/lectures/:lectureId # تحديث محاضرة
DELETE /api/courses/lectures/:lectureId # حذف محاضرة
```

### Enrollments
```
POST   /api/enrollments/:courseId # التسجيل في دورة
GET    /api/enrollments        # دوراتي
GET    /api/enrollments/:id    # تفاصيل التسجيل
PUT    /api/enrollments/:id/lectures/:lectureId/complete # إتمام محاضرة
```

### Quizzes
```
GET    /api/quizzes/:courseId  # اختبارات الدورة
POST   /api/quizzes/:quizId/start # بدء اختبار
POST   /api/quizzes/:quizId/submit # تقديم إجابات
GET    /api/quizzes/:quizId/attempts # محاولاتي
```

### Reviews
```
GET    /api/reviews/:courseId  # مراجعات الدورة
POST   /api/reviews/:courseId  # إضافة مراجعة
PUT    /api/reviews/:id        # تحديث مراجعتي
DELETE /api/reviews/:id        # حذف مراجعتي
POST   /api/reviews/:id/helpful # تقييم المراجعة
```

### Certificates
```
GET    /api/certificates        # شهاداتي
POST   /api/certificates/:courseId/generate # إنشاء شهادة
GET    /api/certificates/:certificateId # تحميل شهادة
GET    /api/certificates/verify/:code # التحقق من شهادة
```

### Search
```
GET    /api/search              # البحث في الدورات
GET    /api/search/suggestions  # اقتراحات البحث
```

### Admin Dashboard
```
GET    /api/admin/dashboard/stats # إحصائيات عامة
GET    /api/admin/dashboard/users # إحصائيات المستخدمين
GET    /api/admin/dashboard/courses # إحصائيات الدورات
```

*(+80 endpoint إضافي لإدارة المستخدمين، الاختبارات، المراجعات، الرفع، إلخ)*

## 🎨 نظام التصميم

### الألوان
```css
--primary: #00d4ff     /* Cyan - اللون الأساسي */
--secondary: #7b2cbf   /* Purple - اللون الثانوي */
--accent: #ff006e      /* Pink - لون التمييز */
--success: #06ffa5     /* Green - النجاح */
```

### Gradients
```css
gradient-primary: #00d4ff → #0099cc → #006699
gradient-secondary: #7b2cbf → #5a1f8f → #3a0f5f  
gradient-accent: #ff006e → #cc0058 → #990042
gradient-hero: #0f0f0f → #1a1a2e → #16213e
```

### تأثيرات Glassmorphism
```css
backdrop-filter: blur(10px)
background: rgba(255, 255, 255, 0.05)
border: 1px solid rgba(255, 255, 255, 0.1)
```

## 📦 الحزم المثبتة

### Backend Dependencies (40 حزمة)
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-mongo-sanitize": "^2.2.0",
  "xss-clean": "^0.1.4",
  "express-fileupload": "^1.4.3",
  "cloudinary": "^1.41.0",
  "nodemailer": "^6.9.7",
  "qrcode": "^1.5.3",
  "pdfkit": "^0.14.0",
  "slugify": "^1.6.6",
  "colors": "^1.4.0",
  "morgan": "^1.10.0",
  "nodemon": "^3.0.2"
}
```

### Frontend Dependencies (20 حزمة)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "framer-motion": "^10.16.16",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^4.12.0",
  "react-player": "^2.13.0",
  "tailwindcss": "^3.3.6",
  "postcss": "^8.4.32",
  "autoprefixer": "^10.4.16",
  "vite": "^7.3.0"
}
```

## 🔒 الأمان

- ✅ **JWT Authentication** مع انتهاء صلاحية بعد 30 يوم
- ✅ **bcryptjs** لتشفير كلمات المرور (10 rounds)
- ✅ **Helmet** لحماية HTTP Headers
- ✅ **Rate Limiting** (100 طلب كل 15 دقيقة)
- ✅ **XSS Protection** ضد هجمات XSS
- ✅ **NoSQL Injection Prevention** تنظيف المدخلات
- ✅ **CORS Configuration** للتحكم في الوصول
- ✅ **HPP Protection** ضد تلوث المعاملات

## 📱 Responsive Design

الموقع متجاوب بالكامل مع جميع الأجهزة:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## ✨ المميزات القادمة

### Frontend (70% متبقي)
- [ ] صفحة الدورات مع الفلاتر والبحث
- [ ] صفحة تفاصيل الدورة الكاملة
- [ ] صفحة التعلم مع مشغل الفيديو
- [ ] صفحة الملف الشخصي
- [ ] صفحة دوراتي
- [ ] صفحة الشهادات
- [ ] لوحة تحكم المدير الكاملة
- [ ] صفحات CRUD للمدير (الدورات، التصنيفات، المستخدمين)
- [ ] نظام الإشعارات
- [ ] الدعم متعدد اللغات (العربية + الإنجليزية)

## 🐛 المشاكل المعروفة

لا توجد مشاكل حاليًا ✅

## 🤝 المساهمة

المشروع مفتوح للمساهمات:

1. Fork المشروع
2. أنشئ Branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License

## 📞 التواصل

- **الموقع:** https://byteqacademy.com
- **البريد:** info@byteqacademy.com
- **GitHub:** https://github.com/byteqacademy

## 🙏 شكر وتقدير

شكراً لجميع المطورين الذين ساهموا في المكتبات المستخدمة في هذا المشروع.

---

صنع بـ ❤️ بواسطة **ByTeq Academy Team**

## 🚀 الحالة الحالية

### Backend Status: ✅ 100%
- 86 ملف مكتمل
- 120+ API Endpoint فعال
- MongoDB متصل ويعمل
- الخادم يعمل على http://localhost:5000

### Frontend Status: 🔄 30%
- مشروع Vite + React مهيأ بالكامل
- Tailwind CSS + تصميم Glassmorphism
- 22 مكون ملف مكتمل:
  - ✅ AuthContext
  - ✅ Button, Input, Card
  - ✅ Navbar, Footer, Modal, Loader
  - ✅ ProtectedRoute
  - ✅ MainLayout, AdminLayout
  - ✅ Home Page (Hero, Stats, Categories, FeaturedCourses)
  - ✅ Login, Register Pages
  - ✅ CourseCard Component
- الخادم يعمل على http://localhost:5173

### المتبقي: 🔄 70%
- 40+ مكون إضافي
- 15+ صفحة
- مكونات Admin كاملة
- صفحة Learning مع Video Player
- صفحة تفاصيل الدورة
- صفحة الدورات مع الفلاتر

**التقدم الإجمالي: 65% مكتمل** 🎉
