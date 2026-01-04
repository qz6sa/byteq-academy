# 📚 ByTeq Academy - API Documentation

## Base URL
```
http://localhost:5000/api
```

## 🔑 Authentication

جميع المسارات المحمية تتطلب JWT Token في الـ Header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Authentication Endpoints

### تسجيل مستخدم جديد
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmad@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "أحمد محمد",
    "email": "ahmad@example.com",
    "role": "student"
  }
}
```

### تسجيل الدخول
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "ahmad@example.com",
  "password": "password123"
}
```

### الحصول على بيانات المستخدم الحالي
```http
GET /api/auth/me
```
**Authorization:** Bearer Token Required

### تسجيل الخروج
```http
GET /api/auth/logout
```
**Authorization:** Bearer Token Required

### تأكيد البريد الإلكتروني
```http
POST /api/auth/verify-email
```

**Body:**
```json
{
  "token": "verification_token_from_email"
}
```

### نسيت كلمة المرور
```http
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "ahmad@example.com"
}
```

### إعادة تعيين كلمة المرور
```http
PUT /api/auth/reset-password/:resetToken
```

**Body:**
```json
{
  "password": "new_password123"
}
```

### تغيير كلمة المرور
```http
PUT /api/auth/update-password
```
**Authorization:** Bearer Token Required

**Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

---

## 📚 Categories Endpoints

### جلب جميع الفئات (Public)
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "Python Programming",
      "slug": "python-programming",
      "description": "تعلم لغة البايثون من الصفر حتى الاحتراف",
      "icon": "python-icon",
      "thumbnail": "...",
      "coursesCount": 12,
      "order": 1
    }
  ]
}
```

### جلب فئة محددة
```http
GET /api/categories/:slug
```

---

## 🎓 Courses Endpoints (Public)

### جلب جميع الدورات
```http
GET /api/courses
```

**Query Parameters:**
- `category` - تصفية حسب الفئة
- `level` - تصفية حسب المستوى (beginner, intermediate, advanced)
- `language` - تصفية حسب اللغة (arabic, english)
- `isFree` - تصفية الدورات المجانية (true/false)
- `sort` - الترتيب (-createdAt, averageRating, studentsCount)
- `page` - رقم الصفحة (default: 1)
- `limit` - عدد النتائج (default: 12)
- `q` - البحث

**Example:**
```http
GET /api/courses?category=python-programming&level=beginner&page=1&limit=12
```

### جلب الدورات المميزة
```http
GET /api/courses/featured
```

### جلب الدورات المجانية
```http
GET /api/courses/free
```

### جلب دورات فئة معينة
```http
GET /api/courses/category/:categorySlug
```

### جلب تفاصيل دورة
```http
GET /api/courses/:slug
```

### معاينة محتوى الدورة
```http
GET /api/courses/:id/preview
```

---

## 📝 Enrollment Endpoints

### التسجيل في دورة
```http
POST /api/enrollments/courses/:courseId/enroll
```
**Authorization:** Bearer Token Required

### جلب تسجيلاتي
```http
GET /api/enrollments/my-enrollments
```
**Authorization:** Bearer Token Required

### تفاصيل تسجيلي في دورة
```http
GET /api/enrollments/courses/:courseId
```
**Authorization:** Bearer Token Required

### إكمال درس
```http
POST /api/enrollments/lectures/:lectureId/complete
```
**Authorization:** Bearer Token Required

### تحديث تقدم درس
```http
PUT /api/enrollments/lectures/:lectureId/progress
```
**Authorization:** Bearer Token Required

**Body:**
```json
{
  "watchTime": 120
}
```

---

## 📝 Quiz Endpoints (Student)

### جلب امتحانات الدورة
```http
GET /api/quizzes/courses/:courseId/quizzes
```
**Authorization:** Bearer Token Required (Enrolled)

### تفاصيل امتحان
```http
GET /api/quizzes/:quizId
```
**Authorization:** Bearer Token Required (Enrolled)

### بدء محاولة جديدة
```http
POST /api/quizzes/:quizId/start
```
**Authorization:** Bearer Token Required (Enrolled)

### تقديم الإجابات
```http
POST /api/quizzes/:quizId/submit
```
**Authorization:** Bearer Token Required (Enrolled)

**Body:**
```json
{
  "answers": [
    {
      "questionId": "...",
      "selectedOptions": [0]
    },
    {
      "questionId": "...",
      "selectedOptions": [1, 3]
    }
  ]
}
```

### جلب محاولاتي
```http
GET /api/quizzes/:quizId/attempts
```
**Authorization:** Bearer Token Required

### نتيجة محاولة محددة
```http
GET /api/quizzes/attempts/:attemptId
```
**Authorization:** Bearer Token Required

---

## ⭐ Reviews Endpoints

### جلب تقييمات دورة
```http
GET /api/reviews/courses/:courseId
```

### إضافة تقييم
```http
POST /api/reviews/courses/:courseId
```
**Authorization:** Bearer Token Required (Enrolled & Completed)

**Body:**
```json
{
  "rating": 5,
  "comment": "دورة ممتازة جداً، شرح واضح ومبسط"
}
```

### تعديل تقييمي
```http
PUT /api/reviews/:reviewId
```
**Authorization:** Bearer Token Required (Owner)

### حذف تقييمي
```http
DELETE /api/reviews/:reviewId
```
**Authorization:** Bearer Token Required (Owner)

### تسجيل helpful
```http
POST /api/reviews/:reviewId/helpful
```
**Authorization:** Bearer Token Required

---

## 🎖️ Certificates Endpoints

### جلب شهاداتي
```http
GET /api/certificates/my-certificates
```
**Authorization:** Bearer Token Required

### إصدار شهادة
```http
POST /api/certificates/generate/:courseId
```
**Authorization:** Bearer Token Required (Completed 100%)

### التحقق من شهادة (Public)
```http
GET /api/certificates/verify/:certificateId
```

### تحميل شهادة PDF
```http
GET /api/certificates/download/:certificateId
```
**Authorization:** Bearer Token Required

---

## 🔍 Search Endpoints

### البحث في الدورات
```http
GET /api/search/courses?q=python
```

### اقتراحات البحث
```http
GET /api/search/suggestions?q=py
```

---

## 👨‍💼 Admin Dashboard Endpoints

### Dashboard Stats
```http
GET /api/admin/dashboard/stats
```
**Authorization:** Bearer Token Required (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalStudents": 145,
    "totalCourses": 25,
    "publishedCourses": 20,
    "totalEnrollments": 450,
    "totalRevenue": 50000,
    "totalReviews": 89,
    "avgRating": 4.7,
    "recentEnrollments": [...],
    "popularCourses": [...]
  }
}
```

---

## 📁 Admin - Category Management

### جلب جميع الفئات (مع غير النشطة)
```http
GET /api/admin/categories
```
**Authorization:** Bearer Token Required (Admin)

### إضافة فئة جديدة
```http
POST /api/admin/categories
```
**Authorization:** Bearer Token Required (Admin)

**Body:**
```json
{
  "name": "Ethical Hacking",
  "description": "تعلم الاختراق الأخلاقي",
  "icon": "hacking-icon",
  "thumbnail": "...",
  "order": 6
}
```

### تفاصيل فئة
```http
GET /api/admin/categories/:id
```

### تعديل فئة
```http
PUT /api/admin/categories/:id
```

### حذف فئة
```http
DELETE /api/admin/categories/:id
```

### تفعيل/إيقاف فئة
```http
PUT /api/admin/categories/:id/toggle-status
```

### إعادة ترتيب الفئات
```http
PUT /api/admin/categories/reorder
```

**Body:**
```json
{
  "categories": [
    { "id": "...", "order": 1 },
    { "id": "...", "order": 2 }
  ]
}
```

---

## 🎓 Admin - Course Management

### جلب جميع الدورات
```http
GET /api/admin/courses
```

### إنشاء دورة جديدة
```http
POST /api/admin/courses
```

### تفاصيل دورة
```http
GET /api/admin/courses/:id
```

### تعديل دورة
```http
PUT /api/admin/courses/:id
```

### حذف دورة
```http
DELETE /api/admin/courses/:id
```

### نشر دورة
```http
POST /api/admin/courses/:id/publish
```

### إلغاء نشر دورة
```http
POST /api/admin/courses/:id/unpublish
```

### جعل الدورة مميزة
```http
PUT /api/admin/courses/:id/featured
```

### تحديث صورة الدورة
```http
POST /api/admin/courses/:id/thumbnail
```

---

## 📂 Admin - Section Management

Base: `/api/admin/courses/:courseId/sections`

### جلب أقسام الدورة
```http
GET /api/admin/courses/:courseId/sections
```

### إضافة قسم
```http
POST /api/admin/courses/:courseId/sections
```

### تعديل قسم
```http
PUT /api/admin/courses/:courseId/sections/:sectionId
```

### حذف قسم
```http
DELETE /api/admin/courses/:courseId/sections/:sectionId
```

### إعادة ترتيب الأقسام
```http
PUT /api/admin/courses/:courseId/sections/reorder
```

---

## 🎥 Admin - Lecture Management

Base: `/api/admin/sections/:sectionId/lectures`

### إضافة درس
```http
POST /api/admin/sections/:sectionId/lectures
```

**Body:**
```json
{
  "title": "مقدمة في البايثون",
  "description": "شرح أساسيات اللغة",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "duration": 25,
  "order": 1,
  "isFree": true,
  "notes": "ملاحظات الدرس..."
}
```

### تعديل درس
```http
PUT /api/admin/sections/:sectionId/lectures/:lectureId
```

### حذف درس
```http
DELETE /api/admin/sections/:sectionId/lectures/:lectureId
```

### رفع ملف للدرس
```http
POST /api/admin/sections/:sectionId/lectures/:lectureId/resources
```

---

## 📝 Admin - Quiz Management

Base: `/api/admin/sections/:sectionId/quizzes`

### إنشاء امتحان
```http
POST /api/admin/sections/:sectionId/quizzes
```

**Body:**
```json
{
  "title": "امتحان البايثون الأساسي",
  "description": "اختبر معلوماتك",
  "passingScore": 70,
  "timeLimit": 30,
  "attemptsAllowed": 3,
  "order": 1
}
```

---

## ❓ Admin - Question Management

Base: `/api/admin/quizzes/:quizId/questions`

### إضافة سؤال
```http
POST /api/admin/quizzes/:quizId/questions
```

**Body:**
```json
{
  "questionText": "ما هي لغة البايثون؟",
  "questionType": "multiple-choice",
  "options": [
    { "text": "لغة برمجة", "isCorrect": true },
    { "text": "نظام تشغيل", "isCorrect": false },
    { "text": "متصفح", "isCorrect": false }
  ],
  "explanation": "البايثون هي لغة برمجة عالية المستوى",
  "points": 2,
  "order": 1
}
```

---

## 👥 Admin - User Management

### جلب جميع المستخدمين
```http
GET /api/admin/users?role=student&search=ahmad&page=1&limit=20
```

### تفاصيل مستخدم
```http
GET /api/admin/users/:id
```

### تغيير دور مستخدم
```http
PUT /api/admin/users/:id/role
```

**Body:**
```json
{
  "role": "admin"
}
```

### حظر/إلغاء حظر مستخدم
```http
PUT /api/admin/users/:id/block
```

### حذف مستخدم
```http
DELETE /api/admin/users/:id
```

---

## 📤 Admin - Upload Routes

### رفع صورة
```http
POST /api/admin/upload/image
```
**Content-Type:** multipart/form-data

**Form Data:**
```
image: [file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "byteq-academy/..."
  }
}
```

### حذف صورة
```http
DELETE /api/admin/upload/image
```

**Body:**
```json
{
  "public_id": "byteq-academy/..."
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "رسالة النجاح",
  "data": { ... },
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "رسالة الخطأ"
}
```

---

## 🔢 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📝 Notes

- جميع التواريخ بصيغة ISO 8601
- الـ Pagination متاح على جميع القوائم
- الفلترة والبحث متاح على معظم Endpoints
- Rate Limiting: 100 requests/15 minutes

---

**🚀 ByTeq Academy API v1.0.0**
