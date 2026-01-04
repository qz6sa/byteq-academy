import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiCheck,
  FiX,
  FiTrash2,
  FiUser,
  FiBookOpen,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';
import { adminReviewsAPI } from '../../api/axios';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Courses for filter
  const [courses, setCourses] = useState([]);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, searchTerm, selectedStatus, selectedRating, selectedCourse]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        isApproved: selectedStatus === 'approved' ? true : selectedStatus === 'pending' ? false : undefined,
        rating: selectedRating || undefined,
        course: selectedCourse || undefined,
      };

      const response = await adminReviewsAPI.getAll(params);
      setReviews(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      });

      // Calculate stats
      const allReviews = response.data || [];
      setStats({
        total: response.pagination?.total || 0,
        pending: allReviews.filter((r) => !r.isApproved).length,
        approved: allReviews.filter((r) => r.isApproved).length,
        averageRating:
          allReviews.length > 0
            ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
            : 0,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('فشل تحميل المراجعات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await adminReviewsAPI.getAll({ limit: 100 });
      // Extract unique courses from reviews
      const uniqueCourses = [];
      const courseIds = new Set();

      response.data?.forEach((review) => {
        if (review.course && !courseIds.has(review.course._id)) {
          courseIds.add(review.course._id);
          uniqueCourses.push(review.course);
        }
      });

      setCourses(uniqueCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await adminReviewsAPI.approve(reviewId);
      toast.success('تم الموافقة على المراجعة بنجاح');
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error(error.response?.data?.message || 'فشل الموافقة على المراجعة');
    }
  };

  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      setDeleting(true);
      await adminReviewsAPI.delete(reviewToDelete._id);
      toast.success('تم حذف المراجعة بنجاح');
      setShowDeleteModal(false);
      setReviewToDelete(null);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'فشل حذف المراجعة');
    } finally {
      setDeleting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
            }`}
            size={16}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-glow-primary">إدارة المراجعات</span>
          </h1>
          <p className="text-gray-400">إجمالي {pagination.total} مراجعة</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <FiStar className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">إجمالي المراجعات</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <FiClock className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-gray-400">قيد المراجعة</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <FiCheck className="text-success text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-gray-400">موافق عليها</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <FiStar className="text-yellow-500 text-xl fill-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.averageRating}</p>
              <p className="text-sm text-gray-400">متوسط التقييم</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المراجعات..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="input-glass w-full pr-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-glass"
          >
            <option value="">جميع الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">موافق عليها</option>
          </select>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => {
              setSelectedRating(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-glass"
          >
            <option value="">جميع التقييمات</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 نجوم)</option>
            <option value="4">⭐⭐⭐⭐ (4 نجوم فأكثر)</option>
            <option value="3">⭐⭐⭐ (3 نجوم فأكثر)</option>
            <option value="2">⭐⭐ (2 نجمة فأكثر)</option>
            <option value="1">⭐ (1 نجمة فأكثر)</option>
          </select>

          {/* Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-glass"
          >
            <option value="">جميع الدورات</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="glass-card">
          <Loader />
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card text-center py-12">
          <FiAlertCircle className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-gray-400 text-lg">لا توجد مراجعات</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      {/* User Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>

                      {/* Review Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold">{review.user?.name}</h4>
                          {renderStars(review.rating)}
                          <span
                            className={`badge text-xs ${
                              review.isApproved ? 'badge-success' : 'badge-warning'
                            }`}
                          >
                            {review.isApproved ? 'موافق عليها' : 'قيد المراجعة'}
                          </span>
                        </div>

                        {/* Course Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                          <FiBookOpen size={14} />
                          <span>{review.course?.title}</span>
                          <span>•</span>
                          <FiClock size={14} />
                          <span>
                            {new Date(review.createdAt).toLocaleDateString('ar-JO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!review.isApproved && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(review._id)}
                        icon={<FiCheck />}
                      >
                        موافقة
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openDeleteModal(review)}
                      icon={<FiTrash2 />}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                السابق
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagination({ ...pagination, page: i + 1 })}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      pagination.page === i + 1
                        ? 'bg-primary text-white'
                        : 'glass-card hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                التالي
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            هل أنت متأكد من حذف مراجعة{' '}
            <span className="text-primary font-bold">
              {reviewToDelete?.user?.name}
            </span>{' '}
            على دورة{' '}
            <span className="text-secondary font-bold">
              {reviewToDelete?.course?.title}
            </span>
            ؟
          </p>

          {reviewToDelete && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(reviewToDelete.rating)}
              </div>
              <p className="text-sm text-gray-400 italic">
                "{reviewToDelete.comment}"
              </p>
            </div>
          )}

          <p className="text-sm text-red-500">
            ⚠️ هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المراجعة نهائياً.
          </p>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              إلغاء
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              حذف المراجعة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageReviews;
