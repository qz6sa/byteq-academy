import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, 
  FiFilter, FiUsers, FiStar, FiDollarSign 
} from 'react-icons/fi';
import { adminCoursesAPI } from '../../api/axios';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Categories
  const [categories, setCategories] = useState([]);
  
  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [pagination.page, searchTerm, selectedCategory, selectedLevel, selectedStatus]);

  const fetchCategories = async () => {
    try {
      const response = await adminCoursesAPI.getAll({ limit: 100 });
      // Get categories from courses
      const uniqueCategories = [];
      const categoryIds = new Set();
      
      response.data?.forEach(course => {
        if (course.category && !categoryIds.has(course.category._id)) {
          categoryIds.add(course.category._id);
          uniqueCategories.push(course.category);
        }
      });
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        level: selectedLevel || undefined,
        isActive: selectedStatus || undefined,
      };

      const response = await adminCoursesAPI.getAll(params);
      setCourses(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('فشل تحميل الدورات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      setDeleting(true);
      await adminCoursesAPI.delete(courseToDelete._id);
      toast.success('تم حذف الدورة بنجاح');
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'فشل حذف الدورة');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const levels = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-glow-primary">إدارة الدورات</span>
          </h1>
          <p className="text-gray-400">
            إجمالي {pagination.total} دورة
          </p>
        </div>
        <Link to="/admin/courses/create">
          <Button variant="primary" icon={<FiPlus />}>
            إضافة دورة جديدة
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث بالعنوان..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="input-glass w-full pr-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-glass"
          >
            <option value="">جميع التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-glass"
          >
            <option value="">جميع المستويات</option>
            <option value="beginner">مبتدئ</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">متقدم</option>
          </select>

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
            <option value="true">نشطة</option>
            <option value="false">غير نشطة</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="glass-card">
          <Loader />
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-gray-400 text-lg">لا توجد دورات</p>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right py-4 px-4">الدورة</th>
                  <th className="text-right py-4 px-4">التصنيف</th>
                  <th className="text-center py-4 px-4">المستوى</th>
                  <th className="text-center py-4 px-4">السعر</th>
                  <th className="text-center py-4 px-4">الطلاب</th>
                  <th className="text-center py-4 px-4">التقييم</th>
                  <th className="text-center py-4 px-4">الحالة</th>
                  <th className="text-center py-4 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <motion.tr
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* Course Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail || '/placeholder-course.jpg'}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-semibold line-clamp-1 mb-1">
                            {course.title}
                          </h4>
                          <p className="text-sm text-gray-400 line-clamp-1">
                            {course.instructor?.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="badge badge-primary">
                        {course.category?.name || 'غير محدد'}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-4 text-center">
                      <span className={`badge ${
                        course.level === 'beginner' ? 'badge-success' :
                        course.level === 'intermediate' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {levels[course.level]}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-primary">
                        {course.isFree ? 'مجاني' : `$${course.price}`}
                      </span>
                    </td>

                    {/* Students */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiUsers className="text-gray-400" />
                        <span>{course.studentsCount || 0}</span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span>{course.averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        course.isActive
                          ? 'bg-success/20 text-success'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {course.isActive ? 'نشطة' : 'معطلة'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/courses/${course.slug}`}>
                          <button className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-primary">
                            <FiEye size={18} />
                          </button>
                        </Link>
                        <Link to={`/admin/courses/edit/${course._id}`}>
                          <button className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-secondary">
                            <FiEdit2 size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(course)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
            هل أنت متأكد من حذف الدورة{' '}
            <span className="text-primary font-bold">"{courseToDelete?.title}"</span>؟
          </p>
          <p className="text-sm text-yellow-500">
            ⚠️ هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع البيانات المرتبطة بالدورة.
          </p>
          
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              حذف الدورة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCourses;
