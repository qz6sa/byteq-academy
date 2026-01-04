import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiShield,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiEye,
  FiMail,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiStar,
} from 'react-icons/fi';
import { adminUsersAPI } from '../../api/axios';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        role: selectedRole || undefined,
        isBlocked: selectedStatus === 'blocked' ? true : selectedStatus === 'active' ? false : undefined,
      };

      const response = await adminUsersAPI.getAll(params);
      setUsers(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = async (user) => {
    try {
      const response = await adminUsersAPI.getById(user._id);
      setSelectedUser(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('فشل تحميل تفاصيل المستخدم');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminUsersAPI.updateRole(userId, newRole);
      toast.success('تم تغيير الدور بنجاح');
      fetchUsers();
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error(error.response?.data?.message || 'فشل تغيير الدور');
    }
  };

  const handleBlockToggle = async (userId, currentBlockStatus) => {
    try {
      await adminUsersAPI.toggleBlock(userId);
      toast.success(currentBlockStatus ? 'تم إلغاء حظر المستخدم' : 'تم حظر المستخدم');
      fetchUsers();
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, isBlocked: !currentBlockStatus });
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      toast.error(error.response?.data?.message || 'فشل تنفيذ العملية');
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await adminUsersAPI.delete(userToDelete._id);
      toast.success('تم حذف المستخدم بنجاح');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'فشل حذف المستخدم');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-glow-primary">إدارة المستخدمين</span>
          </h1>
          <p className="text-gray-400">إجمالي {pagination.total} مستخدم</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="input-glass w-full pr-10"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-glass"
          >
            <option value="">جميع الأدوار</option>
            <option value="student">طالب</option>
            <option value="admin">مشرف</option>
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
            <option value="active">نشط</option>
            <option value="blocked">محظور</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="glass-card">
          <Loader />
        </div>
      ) : users.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-gray-400 text-lg">لا يوجد مستخدمين</p>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right py-4 px-4">المستخدم</th>
                  <th className="text-center py-4 px-4">الدور</th>
                  <th className="text-center py-4 px-4">الدورات</th>
                  <th className="text-center py-4 px-4">الشهادات</th>
                  <th className="text-center py-4 px-4">المراجعات</th>
                  <th className="text-center py-4 px-4">الحالة</th>
                  <th className="text-center py-4 px-4">تاريخ التسجيل</th>
                  <th className="text-center py-4 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* User Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{user.name}</h4>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <FiMail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 text-center">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`badge cursor-pointer ${
                          user.role === 'admin' ? 'badge-danger' : 'badge-primary'
                        }`}
                        style={{
                          background: user.role === 'admin' 
                            ? 'rgba(255, 0, 110, 0.2)' 
                            : 'rgba(0, 212, 255, 0.2)',
                          border: user.role === 'admin'
                            ? '1px solid rgba(255, 0, 110, 0.3)'
                            : '1px solid rgba(0, 212, 255, 0.3)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                        }}
                      >
                        <option value="student">طالب</option>
                        <option value="admin">مشرف</option>
                      </select>
                    </td>

                    {/* Enrollments */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiBookOpen className="text-primary" />
                        <span>{user.enrollmentsCount || 0}</span>
                      </div>
                    </td>

                    {/* Certificates */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiAward className="text-yellow-500" />
                        <span>{user.certificatesCount || 0}</span>
                      </div>
                    </td>

                    {/* Reviews */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span>{user.reviewsCount || 0}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          user.isBlocked
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-success/20 text-success'
                        }`}
                      >
                        {user.isBlocked ? 'محظور' : 'نشط'}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-center text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('ar-JO')}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailsModal(user)}
                          className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                          title="عرض التفاصيل"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isBlocked
                              ? 'hover:bg-success/20 text-success'
                              : 'hover:bg-yellow-500/20 text-yellow-500'
                          }`}
                          title={user.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                        >
                          {user.isBlocked ? <FiUnlock size={18} /> : <FiLock size={18} />}
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                          title="حذف"
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

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المستخدم"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white text-3xl font-bold">
                {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                <p className="text-gray-400">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`badge ${
                      selectedUser.role === 'admin' ? 'badge-danger' : 'badge-primary'
                    }`}
                  >
                    {selectedUser.role === 'admin' ? 'مشرف' : 'طالب'}
                  </span>
                  <span
                    className={`badge ${
                      selectedUser.isBlocked ? 'badge-danger' : 'badge-success'
                    }`}
                  >
                    {selectedUser.isBlocked ? 'محظور' : 'نشط'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card text-center">
                <FiBookOpen className="mx-auto text-3xl text-primary mb-2" />
                <p className="text-2xl font-bold">
                  {selectedUser.enrollmentsCount || 0}
                </p>
                <p className="text-sm text-gray-400">دورة مسجلة</p>
              </div>
              <div className="glass-card text-center">
                <FiAward className="mx-auto text-3xl text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">
                  {selectedUser.certificatesCount || 0}
                </p>
                <p className="text-sm text-gray-400">شهادة</p>
              </div>
              <div className="glass-card text-center">
                <FiStar className="mx-auto text-3xl text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">
                  {selectedUser.reviewsCount || 0}
                </p>
                <p className="text-sm text-gray-400">مراجعة</p>
              </div>
            </div>

            {/* Enrollments List */}
            {selectedUser.enrollments && selectedUser.enrollments.length > 0 && (
              <div>
                <h4 className="font-bold text-lg mb-3">الدورات المسجلة:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedUser.enrollments.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="glass-card flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={enrollment.course?.thumbnail || '/placeholder-course.jpg'}
                          alt={enrollment.course?.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-sm">
                            {enrollment.course?.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            التقدم: {enrollment.progress}%
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <span
                          className={`badge text-xs ${
                            enrollment.status === 'completed'
                              ? 'badge-success'
                              : 'badge-warning'
                          }`}
                        >
                          {enrollment.status === 'completed' ? 'مكتملة' : 'جارية'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="glass-card space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ التسجيل:</span>
                <span>
                  {new Date(selectedUser.createdAt).toLocaleDateString('ar-JO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">آخر تسجيل دخول:</span>
                <span>
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleDateString('ar-JO')
                    : 'لم يسجل دخول بعد'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant={selectedUser.isBlocked ? 'primary' : 'outline'}
                onClick={() => handleBlockToggle(selectedUser._id, selectedUser.isBlocked)}
                icon={selectedUser.isBlocked ? <FiUnlock /> : <FiLock />}
                className="flex-1"
              >
                {selectedUser.isBlocked ? 'إلغاء الحظر' : 'حظر المستخدم'}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShowDetailsModal(false);
                  openDeleteModal(selectedUser);
                }}
                icon={<FiTrash2 />}
                className="flex-1"
              >
                حذف المستخدم
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            هل أنت متأكد من حذف المستخدم{' '}
            <span className="text-primary font-bold">"{userToDelete?.name}"</span>؟
          </p>
          {(userToDelete?.enrollmentsCount > 0 ||
            userToDelete?.certificatesCount > 0 ||
            userToDelete?.reviewsCount > 0) && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-500 text-sm mb-2">
                ⚠️ هذا المستخدم لديه بيانات مرتبطة:
              </p>
              <ul className="text-sm text-gray-300 space-y-1 mr-4">
                {userToDelete.enrollmentsCount > 0 && (
                  <li>• {userToDelete.enrollmentsCount} دورة مسجلة</li>
                )}
                {userToDelete.certificatesCount > 0 && (
                  <li>• {userToDelete.certificatesCount} شهادة</li>
                )}
                {userToDelete.reviewsCount > 0 && (
                  <li>• {userToDelete.reviewsCount} مراجعة</li>
                )}
              </ul>
            </div>
          )}
          <p className="text-sm text-red-500">
            ⚠️ هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع البيانات المرتبطة.
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
              حذف المستخدم
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
