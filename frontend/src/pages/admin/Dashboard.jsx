import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiDollarSign, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';
import { adminDashboardAPI } from '../../api/axios';
import StatsCard from '../../components/admin/StatsCard';
import RecentList from '../../components/admin/RecentList';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminDashboardAPI.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('فشل تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">فشل تحميل البيانات</p>
      </div>
    );
  }

  const statsCards = [
    {
      icon: <FiUsers />,
      title: 'إجمالي الطلاب',
      value: stats.totalStudents?.toLocaleString() || '0',
      subtitle: stats.newStudentsThisMonth > 0 ? `+${stats.newStudentsThisMonth} هذا الشهر` : null,
      gradient: 'from-primary to-cyan-400',
      delay: 0,
    },
    {
      icon: <FiBookOpen />,
      title: 'إجمالي الدورات',
      value: stats.totalCourses?.toLocaleString() || '0',
      subtitle: stats.activeCourses ? `${stats.activeCourses} نشطة` : null,
      gradient: 'from-secondary to-purple-400',
      delay: 0.1,
    },
    {
      icon: <FiDollarSign />,
      title: 'إجمالي الإيرادات',
      value: `$${stats.totalRevenue?.toLocaleString() || '0'}`,
      subtitle: stats.revenueThisMonth > 0 ? `+$${stats.revenueThisMonth.toLocaleString()} هذا الشهر` : null,
      gradient: 'from-accent to-pink-400',
      delay: 0.2,
    },
    {
      icon: <FiStar />,
      title: 'متوسط التقييم',
      value: stats.averageRating?.toFixed(1) || '0.0',
      subtitle: stats.totalReviews ? `من ${stats.totalReviews} مراجعة` : null,
      gradient: 'from-success to-green-400',
      delay: 0.3,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-glow-primary">لوحة التحكم</span>
        </h1>
        <p className="text-gray-400">مرحباً بك في لوحة التحكم الخاصة بأكاديمية ByTeq</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Courses */}
        <RecentList
          title="الدورات الأكثر شعبية"
          items={stats.popularCourses}
          linkText="عرض الكل"
          linkTo="/admin/courses"
          renderItem={(course) => (
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <img
                src={course.thumbnail || '/placeholder-course.jpg'}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold mb-1 line-clamp-1">{course.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiUsers size={14} />
                    {course.studentsCount} طالب
                  </span>
                  <span className="flex items-center gap-1">
                    <FiStar size={14} className="text-yellow-500" />
                    {course.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-primary font-bold">
                  {course.price ? `$${course.price}` : 'مجاني'}
                </p>
              </div>
            </div>
          )}
        />

        {/* Recent Enrollments */}
        <RecentList
          title="آخر التسجيلات"
          items={stats.recentEnrollments}
          linkText="عرض الكل"
          linkTo="/admin/enrollments"
          renderItem={(enrollment) => (
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <img
                src={enrollment.student?.avatar || '/default-avatar.png'}
                alt={enrollment.student?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{enrollment.student?.name}</h4>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {enrollment.course?.title}
                </p>
              </div>
              <div className="text-left text-sm">
                <p className="text-gray-400">
                  {new Date(enrollment.createdAt).toLocaleDateString('ar-JO', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                {enrollment.progress > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{enrollment.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
            <FiTrendingUp />
          </div>
          <h3 className="text-gray-400 text-sm mb-2">إجمالي التسجيلات</h3>
          <p className="text-3xl font-bold text-primary">
            {stats.totalEnrollments?.toLocaleString() || '0'}
          </p>
        </motion.div>

        {/* Completed Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-3xl">
            <FiAward />
          </div>
          <h3 className="text-gray-400 text-sm mb-2">الدورات المكتملة</h3>
          <p className="text-3xl font-bold text-success">
            {stats.completedCourses?.toLocaleString() || '0'}
          </p>
        </motion.div>

        {/* Pending Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl">
            <FiStar />
          </div>
          <h3 className="text-gray-400 text-sm mb-2">المراجعات قيد الانتظار</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {stats.pendingReviews?.toLocaleString() || '0'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
