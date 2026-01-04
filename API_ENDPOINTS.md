# 📡 ByTeq Academy - Complete API Reference

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

### 3. Verify Email
```http
GET /auth/verify-email/:token
```

### 4. Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "ahmed@example.com"
}
```

### 5. Reset Password
```http
PUT /auth/reset-password/:token
Content-Type: application/json

{
  "password": "newPassword123"
}
```

### 6. Update Password
```http
PUT /auth/update-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

### 7. Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

### 8. Logout
```http
GET /auth/logout
Authorization: Bearer {token}
```

---

## 👤 User Profile Endpoints

### 1. Get My Profile
```http
GET /users/me
Authorization: Bearer {token}
```

### 2. Update My Profile
```http
PUT /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "أحمد محمد الجديد",
  "bio": "مطور برمجيات",
  "phone": "01012345678"
}
```

### 3. Upload Avatar
```http
POST /users/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

avatar: [file]
```

### 4. Delete My Account
```http
DELETE /users/me
Authorization: Bearer {token}
```

### 5. Get My Stats
```http
GET /users/stats
Authorization: Bearer {token}
```

---

## 🏷️ Category Endpoints

### 1. Get All Categories
```http
GET /categories
```

### 2. Get Category by Slug
```http
GET /categories/:slug
```

### 3. Get Category Courses
```http
GET /categories/:slug/courses
```

---

## 📚 Course Endpoints (Public)

### 1. Get All Courses
```http
GET /courses?search=python&level=مبتدئ&sort=-createdAt&page=1&limit=10
```

Query Parameters:
- `search` - البحث في العنوان والوصف
- `categoryId` - فلترة حسب الفئة
- `level` - مبتدئ | متوسط | متقدم
- `language` - عربي | إنجليزي
- `isFree` - true | false
- `sort` - -createdAt, price, -averageRating
- `page` - رقم الصفحة
- `limit` - عدد العناصر

### 2. Get Featured Courses
```http
GET /courses/featured
```

### 3. Get Course by Slug
```http
GET /courses/slug/:slug
```

### 4. Get Course Preview
```http
GET /courses/:courseId/preview
```

---

## 📖 Enrollment Endpoints

### 1. Enroll in Course
```http
POST /enrollments/courses/:courseId/enroll
Authorization: Bearer {token}
```

### 2. Get My Enrollments
```http
GET /enrollments/my-enrollments
Authorization: Bearer {token}
```

### 3. Get Enrollment Details
```http
GET /enrollments/courses/:courseId
Authorization: Bearer {token}
```

### 4. Complete Lecture
```http
POST /enrollments/lectures/:lectureId/complete
Authorization: Bearer {token}
```

### 5. Update Lecture Progress
```http
PUT /enrollments/lectures/:lectureId/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "watchTime": 180
}
```

---

## 📝 Quiz Endpoints

### 1. Get Course Quizzes
```http
GET /quizzes/courses/:courseId
Authorization: Bearer {token}
```

### 2. Get Quiz
```http
GET /quizzes/:quizId
Authorization: Bearer {token}
```

### 3. Start Quiz Attempt
```http
POST /quizzes/:quizId/start
Authorization: Bearer {token}
```

### 4. Submit Quiz
```http
POST /quizzes/:quizId/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "attemptId": "quiz_attempt_id",
  "answers": [
    {
      "questionId": "question_id_1",
      "answer": "option_a"
    },
    {
      "questionId": "question_id_2",
      "answer": ["option_a", "option_c"]
    }
  ]
}
```

### 5. Get My Attempts
```http
GET /quizzes/:quizId/my-attempts
Authorization: Bearer {token}
```

### 6. Get Attempt Result
```http
GET /quizzes/attempts/:attemptId
Authorization: Bearer {token}
```

---

## ⭐ Review Endpoints

### 1. Get Course Reviews
```http
GET /reviews/courses/:courseId
```

### 2. Add Review
```http
POST /reviews/courses/:courseId
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "دورة ممتازة جداً!"
}
```

### 3. Update My Review
```http
PUT /reviews/:reviewId
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "دورة جيدة"
}
```

### 4. Delete My Review
```http
DELETE /reviews/:reviewId
Authorization: Bearer {token}
```

### 5. Mark Review as Helpful
```http
POST /reviews/:reviewId/helpful
Authorization: Bearer {token}
```

---

## 🎓 Certificate Endpoints

### 1. Get My Certificates
```http
GET /certificates/my-certificates
Authorization: Bearer {token}
```

### 2. Generate Certificate
```http
POST /certificates/courses/:courseId/generate
Authorization: Bearer {token}
```

### 3. Verify Certificate (Public)
```http
GET /certificates/verify/:certificateId
```

### 4. Download Certificate
```http
GET /certificates/:certificateId/download
Authorization: Bearer {token}
```

---

## 🔍 Search Endpoints

### 1. Search Courses
```http
GET /search/courses?keyword=python&level=مبتدئ&page=1
```

### 2. Get Suggestions
```http
GET /search/suggestions?keyword=pyth
```

---

## 🛡️ Admin Dashboard Endpoints

### 1. Get Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer {admin_token}
```

### 2. Get Users Stats
```http
GET /admin/dashboard/users-stats
Authorization: Bearer {admin_token}
```

### 3. Get Courses Stats
```http
GET /admin/dashboard/courses-stats
Authorization: Bearer {admin_token}
```

### 4. Get Enrollments Stats
```http
GET /admin/dashboard/enrollments-stats
Authorization: Bearer {admin_token}
```

---

## 🏷️ Admin Category Endpoints

### 1. Get All Categories (Admin)
```http
GET /admin/categories
Authorization: Bearer {admin_token}
```

### 2. Create Category
```http
POST /admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "الذكاء الاصطناعي",
  "description": "دورات الذكاء الاصطناعي",
  "image": "https://cloudinary.com/..."
}
```

### 3. Get Category
```http
GET /admin/categories/:categoryId
Authorization: Bearer {admin_token}
```

### 4. Update Category
```http
PUT /admin/categories/:categoryId
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "الذكاء الاصطناعي والتعلم الآلي"
}
```

### 5. Delete Category
```http
DELETE /admin/categories/:categoryId
Authorization: Bearer {admin_token}
```

---

## 📚 Admin Course Endpoints

### 1. Get All Courses (Admin)
```http
GET /admin/courses
Authorization: Bearer {admin_token}
```

### 2. Create Course
```http
POST /admin/courses
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Python للمبتدئين",
  "slug": "python-for-beginners",
  "description": "تعلم برمجة بايثون من الصفر",
  "categoryId": "category_id",
  "price": 0,
  "level": "مبتدئ",
  "language": "عربي",
  "thumbnail": "https://cloudinary.com/...",
  "requirements": ["لا يوجد"],
  "learningOutcomes": ["أساسيات بايثون"]
}
```

### 3. Get Course
```http
GET /admin/courses/:courseId
Authorization: Bearer {admin_token}
```

### 4. Update Course
```http
PUT /admin/courses/:courseId
Authorization: Bearer {admin_token}
Content-Type: application/json
```

### 5. Delete Course
```http
DELETE /admin/courses/:courseId
Authorization: Bearer {admin_token}
```

### 6. Publish Course
```http
PUT /admin/courses/:courseId/publish
Authorization: Bearer {admin_token}
```

### 7. Unpublish Course
```http
PUT /admin/courses/:courseId/unpublish
Authorization: Bearer {admin_token}
```

### 8. Toggle Featured
```http
PUT /admin/courses/:courseId/toggle-featured
Authorization: Bearer {admin_token}
```

---

## 📑 Admin Section Endpoints

### 1. Get All Sections
```http
GET /admin/courses/:courseId/sections
Authorization: Bearer {admin_token}
```

### 2. Create Section
```http
POST /admin/courses/:courseId/sections
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "المقدمة",
  "description": "مقدمة عن الدورة",
  "order": 1
}
```

### 3. Get Section
```http
GET /admin/courses/:courseId/sections/:sectionId
Authorization: Bearer {admin_token}
```

### 4. Update Section
```http
PUT /admin/courses/:courseId/sections/:sectionId
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "المقدمة المحدثة"
}
```

### 5. Delete Section
```http
DELETE /admin/courses/:courseId/sections/:sectionId
Authorization: Bearer {admin_token}
```

### 6. Reorder Sections
```http
PUT /admin/courses/:courseId/sections/reorder
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "sections": [
    { "sectionId": "id1", "order": 1 },
    { "sectionId": "id2", "order": 2 }
  ]
}
```

---

## 🎥 Admin Lecture Endpoints

### 1. Get All Lectures
```http
GET /admin/courses/:courseId/sections/:sectionId/lectures
Authorization: Bearer {admin_token}
```

### 2. Create Lecture
```http
POST /admin/courses/:courseId/sections/:sectionId/lectures
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "ما هي لغة بايثون؟",
  "description": "مقدمة عن لغة بايثون",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "duration": 600,
  "order": 1,
  "isFree": true
}
```

### 3. Get Lecture
```http
GET /admin/courses/:courseId/sections/:sectionId/lectures/:lectureId
Authorization: Bearer {admin_token}
```

### 4. Update Lecture
```http
PUT /admin/courses/:courseId/sections/:sectionId/lectures/:lectureId
Authorization: Bearer {admin_token}
Content-Type: application/json
```

### 5. Delete Lecture
```http
DELETE /admin/courses/:courseId/sections/:sectionId/lectures/:lectureId
Authorization: Bearer {admin_token}
```

### 6. Upload Resource
```http
POST /admin/courses/:courseId/sections/:sectionId/lectures/:lectureId/resources
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "ملف PDF",
  "url": "https://cloudinary.com/...",
  "type": "pdf"
}
```

### 7. Delete Resource
```http
DELETE /admin/courses/:courseId/sections/:sectionId/lectures/:lectureId/resources/:resourceId
Authorization: Bearer {admin_token}
```

### 8. Reorder Lectures
```http
PUT /admin/courses/:courseId/sections/:sectionId/lectures/reorder
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "lectures": [
    { "lectureId": "id1", "order": 1 },
    { "lectureId": "id2", "order": 2 }
  ]
}
```

---

## 📝 Admin Quiz Endpoints

### 1. Get All Quizzes (Admin)
```http
GET /admin/quizzes
Authorization: Bearer {admin_token}
```

### 2. Create Quiz
```http
POST /admin/courses/:courseId/sections/:sectionId/quizzes
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "اختبار المقدمة",
  "description": "اختبر معلوماتك",
  "passingScore": 70,
  "maxAttempts": 3,
  "timeLimit": 30,
  "questions": [
    {
      "questionText": "ما هي لغة بايثون؟",
      "type": "multiple-choice",
      "options": ["لغة برمجة", "نظام تشغيل"],
      "correctAnswer": "لغة برمجة",
      "points": 10
    }
  ]
}
```

### 3. Get Quiz
```http
GET /admin/quizzes/:quizId
Authorization: Bearer {admin_token}
```

### 4. Update Quiz
```http
PUT /admin/quizzes/:quizId
Authorization: Bearer {admin_token}
Content-Type: application/json
```

### 5. Delete Quiz
```http
DELETE /admin/quizzes/:quizId
Authorization: Bearer {admin_token}
```

### 6. Toggle Active
```http
PUT /admin/quizzes/:quizId/toggle-active
Authorization: Bearer {admin_token}
```

---

## 👥 Admin User Management Endpoints

### 1. Get All Users
```http
GET /admin/users
Authorization: Bearer {admin_token}
```

### 2. Get User
```http
GET /admin/users/:userId
Authorization: Bearer {admin_token}
```

### 3. Create User
```http
POST /admin/users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "مستخدم جديد",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### 4. Update User
```http
PUT /admin/users/:userId
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "اسم محدث"
}
```

### 5. Delete User
```http
DELETE /admin/users/:userId
Authorization: Bearer {admin_token}
```

### 6. Change User Role
```http
PUT /admin/users/:userId/change-role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```

### 7. Toggle Block User
```http
PUT /admin/users/:userId/toggle-block
Authorization: Bearer {admin_token}
```

---

## ⭐ Admin Review Management

### 1. Get All Reviews
```http
GET /admin/reviews
Authorization: Bearer {admin_token}
```

### 2. Approve Review
```http
PUT /admin/reviews/:reviewId/approve
Authorization: Bearer {admin_token}
```

### 3. Delete Review
```http
DELETE /admin/reviews/:reviewId
Authorization: Bearer {admin_token}
```

---

## 📖 Admin Enrollment Management

### 1. Get All Enrollments
```http
GET /admin/enrollments
Authorization: Bearer {admin_token}
```

### 2. Get Enrollment
```http
GET /admin/enrollments/:enrollmentId
Authorization: Bearer {admin_token}
```

### 3. Delete Enrollment
```http
DELETE /admin/enrollments/:enrollmentId
Authorization: Bearer {admin_token}
```

---

## 📂 Admin Upload Endpoints

### 1. Upload Image
```http
POST /admin/upload/image
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

image: [file]
folder: "courses"
```

### 2. Delete Image
```http
DELETE /admin/upload/image
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "publicId": "courses/image_id"
}
```

---

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "message": "رسالة النجاح",
  "data": { ... },
  "count": 10
}
```

### Error Response:
```json
{
  "success": false,
  "message": "رسالة الخطأ"
}
```

---

## 🔑 Authentication

معظم Endpoints تحتاج إلى JWT Token في الـ Headers:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

للحصول على Token:
1. قم بتسجيل الدخول عبر `/api/auth/login`
2. استخدم الـ `token` المرجع في الـ Authorization Header

---

## 📝 Notes

- جميع المسارات تبدأ بـ `/api`
- الـ Admin endpoints تحتاج `role: admin`
- الـ Rate Limit: 100 طلب كل 15 دقيقة
- حجم الملفات المرفوعة: 5MB كحد أقصى
- الصور المدعومة: jpg, jpeg, png, gif

---

**© 2024 ByTeq Academy - Complete API Reference**
