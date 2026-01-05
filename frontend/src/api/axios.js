import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - إضافة Token تلقائياً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - معالجة الأخطاء
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'حدث خطأ غير متوقع';
    
    // إذا كان الخطأ 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('انتهت جلستك، يرجى تسجيل الدخول مرة أخرى');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
};

// Categories APIs
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  getCategoryCourses: (slug) => api.get(`/categories/${slug}/courses`),
};

// Courses APIs
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getBySlug: (slug) => api.get(`/courses/slug/${slug}`),
  getPreview: (id) => api.get(`/courses/${id}/preview`),
};

// Enrollment APIs
export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/enrollments/courses/${courseId}/enroll`),
  getMy: () => api.get('/enrollments/my-enrollments'),
  getDetails: (courseId) => api.get(`/enrollments/courses/${courseId}`),
  completeLecture: (lectureId) => api.post(`/enrollments/lectures/${lectureId}/complete`),
  updateProgress: (lectureId, data) => api.put(`/enrollments/lectures/${lectureId}/progress`, data),
};

// Quiz APIs
export const quizAPI = {
  getCourseQuizzes: (courseId) => api.get(`/quizzes/courses/${courseId}`),
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  startAttempt: (quizId) => api.post(`/quizzes/${quizId}/start`),
  submitQuiz: (quizId, data) => api.post(`/quizzes/${quizId}/submit`, data),
  getMyAttempts: (quizId) => api.get(`/quizzes/${quizId}/my-attempts`),
  getAttemptResult: (attemptId) => api.get(`/quizzes/attempts/${attemptId}`),
};

// Review APIs
export const reviewAPI = {
  getCourseReviews: (courseId) => api.get(`/reviews/courses/${courseId}`),
  addReview: (courseId, data) => api.post(`/reviews/courses/${courseId}`, data),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  markHelpful: (reviewId) => api.post(`/reviews/${reviewId}/helpful`),
};

// Certificate APIs
export const certificateAPI = {
  getMyCertificates: () => api.get('/certificates/my-certificates'),
  generate: (courseId) => api.post(`/certificates/courses/${courseId}/generate`),
  verify: (certificateId) => api.get(`/certificates/verify/${certificateId}`),
  download: (certificateId) => api.get(`/certificates/${certificateId}/download`),
};

// User APIs
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMe: () => api.delete('/users/me'),
  getStats: () => api.get('/users/stats'),
};

// Search APIs
export const searchAPI = {
  searchCourses: (params) => api.get('/search/courses', { params }),
  getSuggestions: (keyword) => api.get('/search/suggestions', { params: { keyword } }),
};

// Admin Dashboard APIs
export const adminDashboardAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getUsersStats: () => api.get('/admin/dashboard/users-stats'),
  getCoursesStats: () => api.get('/admin/dashboard/courses-stats'),
  getEnrollmentsStats: () => api.get('/admin/dashboard/enrollments-stats'),
};

// Admin Categories APIs
export const adminCategoriesAPI = {
  getAll: () => api.get('/admin/categories'),
  getById: (id) => api.get(`/admin/categories/${id}`),
  create: (data) => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// Admin Courses APIs
export const adminCoursesAPI = {
  getAll: (params) => api.get('/admin/courses', { params }),
  getById: (id) => api.get(`/admin/courses/${id}`),
  create: (data) => api.post('/admin/courses', data),
  update: (id, data) => api.put(`/admin/courses/${id}`, data),
  delete: (id) => api.delete(`/admin/courses/${id}`),
  publish: (id) => api.put(`/admin/courses/${id}/publish`),
  unpublish: (id) => api.put(`/admin/courses/${id}/unpublish`),
  toggleFeatured: (id) => api.put(`/admin/courses/${id}/toggle-featured`),
};

// Admin Users APIs
export const adminUsersAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleBlock: (id) => api.put(`/admin/users/${id}/block`),
};

// Admin Reviews APIs
export const adminReviewsAPI = {
  getAll: (params) => api.get('/admin/reviews', { params }),
  getById: (id) => api.get(`/admin/reviews/${id}`),
  approve: (id) => api.put(`/admin/reviews/${id}/approve`),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
};

export default api;
