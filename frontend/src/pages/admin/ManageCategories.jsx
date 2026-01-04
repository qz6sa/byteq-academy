import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { categoriesAPI } from '../../api/axios';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('فشل تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
    });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error('الاسم والـ Slug مطلوبان');
      return;
    }

    try {
      setSubmitting(true);

      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
        toast.success('تم تحديث التصنيف بنجاح');
      } else {
        await categoriesAPI.create(formData);
        toast.success('تم إضافة التصنيف بنجاح');
      }

      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'فشل حفظ التصنيف');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      await categoriesAPI.delete(categoryToDelete._id);
      toast.success('تم حذف التصنيف بنجاح');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'فشل حذف التصنيف');
    } finally {
      setDeleting(false);
    }
  };

  // Common icons list
  const iconOptions = [
    { value: '🔐', label: 'قفل' },
    { value: '🛡️', label: 'درع' },
    { value: '💻', label: 'كمبيوتر' },
    { value: '🌐', label: 'شبكة' },
    { value: '🔒', label: 'أمان' },
    { value: '🎯', label: 'هدف' },
    { value: '📱', label: 'موبايل' },
    { value: '⚡', label: 'برق' },
    { value: '🚀', label: 'صاروخ' },
    { value: '💼', label: 'حقيبة' },
    { value: '🎓', label: 'تخرج' },
    { value: '📊', label: 'رسم بياني' },
    { value: '🔍', label: 'بحث' },
    { value: '⚙️', label: 'إعدادات' },
    { value: '🏆', label: 'كأس' },
    { value: '📚', label: 'كتب' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-glow-primary">إدارة التصنيفات</span>
          </h1>
          <p className="text-gray-400">إجمالي {categories.length} تصنيف</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={openCreateModal}>
          إضافة تصنيف
        </Button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="glass-card">
          <Loader />
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-gray-400 text-lg mb-4">لا توجد تصنيفات</p>
          <Button variant="primary" icon={<FiPlus />} onClick={openCreateModal}>
            إضافة تصنيف جديد
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card group hover:scale-105 transition-transform"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan-400 text-3xl mb-4 mx-auto">
                {category.icon || '📁'}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-center mb-2">
                {category.name}
              </h3>

              {/* Description */}
              {category.description && (
                <p className="text-sm text-gray-400 text-center mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Slug */}
              <div className="text-center mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400">
                  {category.slug}
                </span>
              </div>

              {/* Courses Count */}
              <div className="flex items-center justify-center gap-2 mb-4 text-primary">
                <FiBookOpen />
                <span className="text-sm font-semibold">
                  {category.coursesCount || 0} دورة
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 py-2 px-4 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors text-secondary font-semibold"
                >
                  <FiEdit2 className="inline ml-2" />
                  تعديل
                </button>
                <button
                  onClick={() => openDeleteModal(category)}
                  className="flex-1 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-500 font-semibold"
                >
                  <FiTrash2 className="inline ml-2" />
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              اسم التصنيف *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-glass w-full"
              placeholder="مثال: الأمن السيبراني"
              required
              disabled={submitting}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slug (للرابط) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="input-glass w-full"
              placeholder="cyber-security"
              required
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              سيتم إنشاؤه تلقائياً من الاسم
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              الوصف (اختياري)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input-glass w-full"
              placeholder="وصف مختصر للتصنيف..."
              disabled={submitting}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium mb-2">
              الأيقونة (اختياري)
            </label>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {iconOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, icon: option.value })
                  }
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-all ${
                    formData.icon === option.value
                      ? 'bg-primary scale-110'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  disabled={submitting}
                  title={option.label}
                >
                  {option.value}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="input-glass w-full"
              placeholder="أو أدخل رمز تعبيري مخصص 😊"
              disabled={submitting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingCategory ? 'حفظ التعديلات' : 'إضافة التصنيف'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            هل أنت متأكد من حذف تصنيف{' '}
            <span className="text-primary font-bold">
              "{categoryToDelete?.name}"
            </span>
            ؟
          </p>
          {categoryToDelete?.coursesCount > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-500 text-sm">
                ⚠️ هذا التصنيف يحتوي على {categoryToDelete.coursesCount} دورة. سيتم
                إزالة التصنيف من جميع الدورات المرتبطة به.
              </p>
            </div>
          )}
          <p className="text-sm text-gray-400">
            هذا الإجراء لا يمكن التراجع عنه.
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
              حذف التصنيف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCategories;
