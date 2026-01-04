# 🚀 دليل البدء السريع - ByTeq Academy Backend

## الخطوة 1: التثبيت

```bash
cd backend
npm install
```

## الخطوة 2: إعداد البيئة

انسخ `.env.example` إلى `.env` وعدّل القيم:

```bash
cp .env.example .env
```

### المتغيرات المطلوبة:

```env
# قاعدة البيانات (MongoDB)
MONGO_URI=mongodb://localhost:27017/byteq-academy

# JWT Secret (غيّره!)
JWT_SECRET=your_very_long_secret_key_min_32_characters

# Cloudinary (للصور)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (للبريد)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## الخطوة 3: تشغيل MongoDB

تأكد من تشغيل MongoDB:

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongodb
```

## الخطوة 4: إضافة البيانات الأولية

```bash
npm run seed
```

سيضيف:
- 5 فئات أساسية
- حساب Admin للتجربة

**بيانات Admin:**
- Email: `admin@byteqacademy.com`
- Password: `admin123456`

## الخطوة 5: تشغيل السيرفر

```bash
# Development mode
npm run dev

# Production mode
npm start
```

السيرفر سيعمل على: **http://localhost:5000**

## الخطوة 6: اختبار API

### تسجيل مستخدم جديد

```bash
POST http://localhost:5000/api/auth/register

Body:
{
  "name": "أحمد محمد",
  "email": "ahmad@example.com",
  "password": "password123"
}
```

### تسجيل دخول Admin

```bash
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "admin@byteqacademy.com",
  "password": "admin123456"
}
```

### جلب الفئات

```bash
GET http://localhost:5000/api/categories
```

---

## 🧪 اختبار باستخدام Postman/Thunder Client

### 1. إنشاء Environment جديد

```
Base URL: http://localhost:5000/api
Token: (سيتم إضافته بعد تسجيل الدخول)
```

### 2. تسجيل الدخول واحصل على Token

```bash
POST {{baseUrl}}/auth/login
```

### 3. استخدم Token في الـ Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📂 هيكل المشروع

```
backend/
├── config/          # MongoDB & Cloudinary
├── controllers/     # Business Logic
├── models/          # Database Schemas
├── routes/          # API Routes
├── middleware/      # Auth, Error, Upload
├── utils/           # Helpers
├── .env             # Environment Variables
└── server.js        # Entry Point
```

---

## ✅ ما تم إنجازه

✅ نظام المصادقة الكامل  
✅ جميع Models (11 model)  
✅ Category System (Public + Admin)  
✅ Helper Utilities  
✅ Email System  
✅ PDF Certificate Generation  
✅ YouTube Integration  
✅ Progress Tracking  

---

## 🔨 ما يجب إكماله

❌ Course Controllers & Routes  
❌ Enrollment System  
❌ Quiz System  
❌ Review System  
❌ Certificate Controllers  
❌ User Profile  
❌ Admin Dashboard  
❌ Search System  
❌ Validators  

راجع: **PROJECT_COMPLETION_GUIDE.md**

---

## 📚 الموارد

- **README.md** - توثيق شامل
- **API_DOCUMENTATION.md** - توثيق API
- **PROJECT_COMPLETION_GUIDE.md** - دليل إكمال المشروع

---

## 🆘 استكشاف الأخطاء

### MongoDB Connection Error

```bash
# تأكد من تشغيل MongoDB
mongod --version

# تحقق من MONGO_URI في .env
```

### Port Already in Use

```bash
# غيّر PORT في .env
PORT=5001
```

### Cloudinary Upload Error

```bash
# تحقق من credentials في .env
# تأكد من اتصال الإنترنت
```

---

## 📧 إعداد Gmail

1. اذهب إلى: https://myaccount.google.com/security
2. فعّل 2-Factor Authentication
3. اذهب إلى App Passwords
4. أنشئ App Password جديد
5. استخدمه في `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

---

## ☁️ إعداد Cloudinary

1. اذهب إلى: https://cloudinary.com/users/register/free
2. سجّل حساب جديد
3. احصل على Cloud Name, API Key, API Secret
4. ضعها في `.env`

---

## 🎯 الخطوات التالية

1. راجع `PROJECT_COMPLETION_GUIDE.md`
2. ابدأ بإكمال Course System
3. اختبر كل endpoint بعد إنشائه
4. استخدم Postman للتجربة

---

**🚀 جاهز للبدء!**

للدعم: راجع الملفات التوثيقية أو افتح Issue على GitHub
