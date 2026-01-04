import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX,
  FiCamera, FiLock, FiBookOpen, FiAward, FiClock, FiTrendingUp,
  FiCalendar, FiCheckCircle, FiBook, FiVideo, FiStar
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, authAPI } from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // info, courses, certificates, settings
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    certificates: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      });
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentAPI.getMy();
      setEnrollments(data.enrollments || []);
      calculateStats(data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const calculateStats = (enrollmentsList) => {
    const total = enrollmentsList.length;
    const completed = enrollmentsList.filter((e) => e.progress === 100).length;
    const inProgress = total - completed;
    const totalHours = enrollmentsList.reduce((acc, e) => acc + (e.course?.duration || 0), 0);

    setStats({
      totalCourses: total,
      completedCourses: completed,
      inProgressCourses: inProgress,
      totalHours,
      certificates: completed,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.updateProfile(formData);
      updateUser(data.user);
      toast.success('تم تحديث الملف الشخصي بنجاح! ✅');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('تم تحديث كلمة المرور بنجاح! 🔒');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تحديث كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  const statsCards = [
    {
      icon: FiBookOpen,
      label: 'إجمالي الدورات',
      value: stats.totalCourses,
      color: 'primary',
      bgColor: 'bg-primary/20',
    },
    {
      icon: FiCheckCircle,
      label: 'دورات مكتملة',
      value: stats.completedCourses,
      color: 'success',
      bgColor: 'bg-success/20',
    },
    {
      icon: FiTrendingUp,
      label: 'قيد التقدم',
      value: stats.inProgressCourses,
      color: 'warning',
      bgColor: 'bg-warning/20',
    },
    {
      icon: FiClock,
      label: 'ساعات التعلم',
      value: `${stats.totalHours}`,
      color: 'accent',
      bgColor: 'bg-accent/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-5xl font-bold shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <FiCamera className="text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FiPhone className="text-primary" />
                    {user.phone}
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FiMapPin className="text-primary" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <FiCalendar className="text-primary" />
                  انضم {new Date(user?.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                </div>
              </div>
              {user?.bio && (
                <p className="mt-4 text-gray-300 leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FiEdit2 />
                تعديل الملف
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-5 text-center hover:scale-105 transition-transform"
            >
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`text-2xl text-${stat.color}`} />
              </div>
              <div className={`text-2xl md:text-3xl font-bold mb-1 text-${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'info', label: 'المعلومات الشخصية', icon: FiUser },
            { id: 'courses', label: 'دوراتي', icon: FiBook },
            { id: 'certificates', label: 'الشهادات', icon: FiAward },
            { id: 'settings', label: 'الإعدادات', icon: FiLock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white font-bold'
                  : 'glass-card hover:border-primary/50'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          
          {/* Personal Info Tab */}
          {activeTab === 'info' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">المعلومات الشخصية</h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiSave />
                      حفظ
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <FiX />
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block mb-2 text-sm font-medium">الاسم الكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                               focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                               focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                               focus:border-primary focus:outline-none"
                      placeholder="اختياري"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">الموقع</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                               focus:border-primary focus:outline-none"
                      placeholder="المدينة، البلد"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">نبذة عني</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                               focus:border-primary focus:outline-none resize-none"
                      placeholder="اكتب نبذة مختصرة عنك..."
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center gap-4 py-4 border-b border-white/10">
                    <FiUser className="text-2xl text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">الاسم الكامل</p>
                      <p className="font-bold">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-b border-white/10">
                    <FiMail className="text-2xl text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                      <p className="font-bold">{user?.email}</p>
                    </div>
                  </div>

                  {user?.phone && (
                    <div className="flex items-center gap-4 py-4 border-b border-white/10">
                      <FiPhone className="text-2xl text-primary" />
                      <div>
                        <p className="text-sm text-gray-400">رقم الهاتف</p>
                        <p className="font-bold">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user?.location && (
                    <div className="flex items-center gap-4 py-4 border-b border-white/10">
                      <FiMapPin className="text-2xl text-primary" />
                      <div>
                        <p className="text-sm text-gray-400">الموقع</p>
                        <p className="font-bold">{user.location}</p>
                      </div>
                    </div>
                  )}

                  {user?.bio && (
                    <div className="py-4">
                      <p className="text-sm text-gray-400 mb-2">نبذة عني</p>
                      <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">دوراتي المسجلة</h2>
              
              {enrollments.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {enrollments.map((enrollment) => (
                    <Link
                      key={enrollment._id}
                      to={`/learn/${enrollment.course._id}`}
                      className="glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
                    >
                      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                        {enrollment.course.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiVideo className="text-6xl text-white/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          {enrollment.progress || 0}% مكتمل
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {enrollment.course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <FiClock />
                            {enrollment.course.duration || 0} ساعة
                          </span>
                          <span className="flex items-center gap-1">
                            <FiStar className="text-warning" />
                            {enrollment.course.rating || 0}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary transition-all duration-300"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiBookOpen className="text-6xl text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-gray-400 mb-6">لم تسجل في أي دورة بعد</p>
                  <Link to="/courses" className="btn-primary inline-block">
                    تصفح الدورات
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">شهاداتي</h2>
              
              {stats.completedCourses > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {enrollments
                    .filter((e) => e.progress === 100)
                    .map((enrollment) => (
                      <div
                        key={enrollment._id}
                        className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiAward className="text-3xl text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{enrollment.course.title}</h3>
                            <p className="text-sm text-gray-400 mb-3">
                              أكملت في {new Date(enrollment.completedAt).toLocaleDateString('ar-SA')}
                            </p>
                            <button className="btn-primary text-sm px-4 py-2">
                              تحميل الشهادة
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiAward className="text-6xl text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-gray-400 mb-2">لا توجد شهادات بعد</p>
                  <p className="text-sm text-gray-500 mb-6">أكمل دورة للحصول على شهادتك الأولى!</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">الإعدادات</h2>

              <div className="space-y-6 max-w-2xl">
                {/* Change Password Section */}
                <div className="border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">تغيير كلمة المرور</h3>
                      <p className="text-sm text-gray-400">حدّث كلمة المرور الخاصة بك</p>
                    </div>
                    {!showPasswordForm && (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FiLock />
                        تغيير
                      </button>
                    )}
                  </div>

                  {showPasswordForm && (
                    <form onSubmit={handleUpdatePassword} className="space-y-4 mt-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium">كلمة المرور الحالية</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                                   focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium">كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                                   focus:border-primary focus:outline-none"
                          required
                          minLength={6}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium">تأكيد كلمة المرور</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                                   focus:border-primary focus:outline-none"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex items-center gap-2"
                        >
                          <FiSave />
                          حفظ كلمة المرور
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                          className="btn-secondary"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Account Type */}
                <div className="border border-white/10 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-1">نوع الحساب</h3>
                  <p className="text-sm text-gray-400 mb-4">حسابك الحالي</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg font-bold">
                    {user?.role === 'admin' ? '👑 مدير' : user?.role === 'instructor' ? '👨‍🏫 مدرب' : '👤 طالب'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
