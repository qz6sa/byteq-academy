import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiClock, FiBarChart, FiStar, FiUsers, FiBookOpen, FiAward, 
  FiPlay, FiCheck, FiShare2, FiHeart, FiDownload, FiLock,
  FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { coursesAPI, enrollmentAPI, reviewAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, curriculum, reviews
  const [expandedSections, setExpandedSections] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchCourseDetails();
    if (user) {
      checkEnrollment();
    }
  }, [slug, user]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const data = await coursesAPI.getBySlug(slug);
      setCourse(data.course);
      
      // Fetch reviews
      const reviewsData = await reviewAPI.getCourseReviews(data.course._id);
      setReviews(reviewsData.reviews || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('فشل تحميل تفاصيل الدورة');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!course) return;
    try {
      const data = await enrollmentAPI.getMy();
      const enrolled = data.enrollments?.some(e => e.course._id === course._id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }

    try {
      await enrollmentAPI.enroll(course._id);
      toast.success('تم التسجيل في الدورة بنجاح! 🎉');
      setIsEnrolled(true);
      navigate(`/learn/${course._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل التسجيل في الدورة');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    try {
      await reviewAPI.addReview(course._id, reviewForm);
      toast.success('تم إضافة تقييمك بنجاح! ⭐');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchCourseDetails(); // Refresh to show new review
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إضافة التقييم');
    }
  };

  const levelLabels = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  };

  const levelColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="text-6xl text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">الدورة غير موجودة</h2>
          <button onClick={() => navigate('/courses')} className="btn-primary mt-4">
            العودة للدورات
          </button>
        </div>
      </div>
    );
  }

  const totalLectures = course.curriculum?.reduce((acc, section) => acc + (section.lectures?.length || 0), 0) || 0;
  const avgRating = course.rating || 0;
  const reviewCount = course.reviewCount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <button onClick={() => navigate('/courses')} className="hover:text-primary">
                  الدورات
                </button>
                <span>/</span>
                <span className="text-white">{course.title}</span>
              </div>

              {/* Title & Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow-primary leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {course.shortDescription}
                </p>
              </motion.div>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <div className="flex items-center gap-2">
                  <FiStar className="text-warning fill-warning" />
                  <span className="font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-400">({reviewCount} تقييم)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FiUsers className="text-primary" />
                  <span>{course.enrollmentCount || 0} طالب</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FiClock className="text-primary" />
                  <span>{course.duration || 0} ساعة</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FiBookOpen className="text-primary" />
                  <span>{totalLectures} محاضرة</span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-${levelColors[course.level]}/20 text-${levelColors[course.level]}`}>
                  {levelLabels[course.level]}
                </span>
              </motion.div>

              {/* Instructor */}
              {course.instructor && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold">
                    {course.instructor.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">المدرب</p>
                    <p className="font-bold">{course.instructor.name}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar - Course Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl overflow-hidden sticky top-24"
              >
                {/* Video Preview */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  {course.previewVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={course.previewVideo}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <img
                        src={course.thumbnail || '/default-course.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <FiPlay className="text-3xl text-white mr-1" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {course.price === 0 ? 'مجاني' : `$${course.price}`}
                    </div>
                    {course.price > 0 && course.originalPrice && (
                      <div className="text-gray-400 line-through text-sm">
                        ${course.originalPrice}
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/learn/${course._id}`)}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      <FiPlay className="inline ml-2" />
                      متابعة التعلم
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      {course.price === 0 ? 'التسجيل المجاني' : 'اشتر الآن'}
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 glass-card py-3 rounded-lg hover:border-primary/50 transition-all">
                      <FiHeart className="inline ml-1" />
                      المفضلة
                    </button>
                    <button className="flex-1 glass-card py-3 rounded-lg hover:border-primary/50 transition-all">
                      <FiShare2 className="inline ml-1" />
                      مشاركة
                    </button>
                  </div>

                  {/* What's Included */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="font-bold mb-3">تشمل هذه الدورة:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-success" />
                        <span>{course.duration || 0} ساعات فيديو عند الطلب</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-success" />
                        <span>{totalLectures} محاضرة</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-success" />
                        <span>وصول كامل مدى الحياة</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-success" />
                        <span>شهادة إتمام</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-success" />
                        <span>موارد قابلة للتحميل</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: FiBookOpen },
              { id: 'curriculum', label: 'المنهج', icon: FiPlay },
              { id: 'reviews', label: `التقييمات (${reviewCount})`, icon: FiStar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Description */}
                  <div className="glass-card p-8 rounded-xl">
                    <h2 className="text-2xl font-bold mb-4">وصف الدورة</h2>
                    <div 
                      className="text-gray-300 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  </div>

                  {/* What You'll Learn */}
                  {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                    <div className="glass-card p-8 rounded-xl">
                      <h2 className="text-2xl font-bold mb-6">ما ستتعلمه</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <FiCheck className="text-success text-xl mt-1 flex-shrink-0" />
                            <span className="text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {course.requirements && course.requirements.length > 0 && (
                    <div className="glass-card p-8 rounded-xl">
                      <h2 className="text-2xl font-bold mb-6">المتطلبات</h2>
                      <ul className="space-y-3">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300">
                            <span className="text-primary mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Target Audience */}
                  {course.targetAudience && course.targetAudience.length > 0 && (
                    <div className="glass-card p-8 rounded-xl">
                      <h2 className="text-2xl font-bold mb-6">لمن هذه الدورة؟</h2>
                      <ul className="space-y-3">
                        {course.targetAudience.map((audience, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300">
                            <span className="text-primary mt-1">•</span>
                            <span>{audience}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="glass-card p-6 rounded-xl mb-6">
                    <h2 className="text-2xl font-bold mb-2">محتوى الدورة</h2>
                    <p className="text-gray-400">
                      {course.curriculum?.length || 0} أقسام • {totalLectures} محاضرة • 
                      {course.duration || 0} ساعة من المحتوى
                    </p>
                  </div>

                  {course.curriculum?.map((section, sectionIndex) => (
                    <div key={section._id} className="glass-card rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1 text-right">
                          <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {sectionIndex + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{section.title}</h3>
                            <p className="text-sm text-gray-400">
                              {section.lectures?.length || 0} محاضرات
                            </p>
                          </div>
                        </div>
                        {expandedSections.includes(section._id) ? (
                          <FiChevronUp className="text-primary text-xl" />
                        ) : (
                          <FiChevronDown className="text-gray-400 text-xl" />
                        )}
                      </button>

                      {expandedSections.includes(section._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10"
                        >
                          {section.lectures?.map((lecture, lectureIndex) => (
                            <div
                              key={lecture._id}
                              className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5 last:border-b-0"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <FiPlay className="text-primary" />
                                <span className="text-gray-300">{lecture.title}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                {lecture.duration && (
                                  <span>{lecture.duration} دقيقة</span>
                                )}
                                {!isEnrolled && lectureIndex > 0 && (
                                  <FiLock className="text-gray-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Add Review Button */}
                  {user && isEnrolled && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="btn-primary mb-6"
                    >
                      <FiStar className="inline ml-2" />
                      أضف تقييمك
                    </button>
                  )}

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="glass-card p-6 rounded-xl mb-6">
                      <h3 className="font-bold text-xl mb-4">أضف تقييمك</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm">التقييم</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="text-3xl"
                              >
                                <FiStar 
                                  className={star <= reviewForm.rating ? 'text-warning fill-warning' : 'text-gray-600'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm">تعليقك</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                                     focus:border-primary focus:outline-none"
                            placeholder="شارك تجربتك مع الدورة..."
                            required
                          />
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="btn-primary">
                            إرسال التقييم
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="btn-secondary"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="glass-card p-6 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold">
                                {review.user?.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold">{review.user?.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={`text-sm ${
                                          i < review.rating ? 'text-warning fill-warning' : 'text-gray-600'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span>•</span>
                                  <span>{new Date(review.createdAt).toLocaleDateString('ar-SA')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 glass-card rounded-xl">
                      <FiStar className="text-5xl text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">لا توجد تقييمات بعد</p>
                      {user && isEnrolled && (
                        <p className="text-sm text-gray-500 mt-2">كن أول من يقيم هذه الدورة!</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Course Features */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4">ميزات الدورة</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FiClock className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">المدة</p>
                      <p className="font-bold">{course.duration || 0} ساعة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <FiBarChart className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">المستوى</p>
                      <p className="font-bold">{levelLabels[course.level]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                      <FiBookOpen className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">المحاضرات</p>
                      <p className="font-bold">{totalLectures} محاضرة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <FiAward className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">الشهادة</p>
                      <p className="font-bold">عند الإتمام</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Courses */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4">دورات مقترحة</h3>
                <p className="text-sm text-gray-400">قريباً...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
