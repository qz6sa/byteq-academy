import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward, FiMaximize, FiVolume2,
  FiVolumeX, FiCheck, FiChevronDown, FiChevronUp, FiLock, FiBookOpen,
  FiDownload, FiMessageSquare, FiFileText, FiMenu, FiX, FiCheckCircle,
  FiClock, FiBarChart, FiAward, FiArrowRight, FiArrowLeft
} from 'react-icons/fi';
import { coursesAPI, enrollmentAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Learning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, resources, qa, notes
  const [expandedSections, setExpandedSections] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState({});

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCourseData();
  }, [courseId, user]);

  useEffect(() => {
    if (course?.curriculum && course.curriculum.length > 0) {
      // Set first lecture as default if no current lecture
      if (!currentLecture) {
        const firstSection = course.curriculum[0];
        const firstLecture = firstSection.lectures?.[0];
        if (firstLecture) {
          setCurrentLecture(firstLecture);
          setCurrentSection(firstSection);
          setExpandedSections([firstSection._id]);
        }
      }
    }
  }, [course]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // Fetch course details
      const courseData = await coursesAPI.getById(courseId);
      setCourse(courseData.course);

      // Fetch enrollment to check progress
      const enrollmentData = await enrollmentAPI.getMy();
      const userEnrollment = enrollmentData.enrollments?.find(
        (e) => e.course._id === courseId
      );
      
      if (!userEnrollment) {
        toast.error('يجب التسجيل في الدورة أولاً');
        navigate(`/courses/${courseData.course.slug}`);
        return;
      }
      
      setEnrollment(userEnrollment);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('فشل تحميل بيانات الدورة');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectLecture = (lecture, section) => {
    setCurrentLecture(lecture);
    setCurrentSection(section);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
    // Load saved notes for this lecture
    const lectureNotes = savedNotes[lecture._id] || '';
    setNotes(lectureNotes);
  };

  const markLectureComplete = async (lectureId) => {
    try {
      await enrollmentAPI.markLectureComplete(enrollment._id, lectureId);
      toast.success('تم تعليم المحاضرة كمكتملة! ✅');
      // Update local enrollment state
      setEnrollment((prev) => ({
        ...prev,
        completedLectures: [...(prev.completedLectures || []), lectureId],
      }));
    } catch (error) {
      toast.error('فشل تحديث الحالة');
    }
  };

  const isLectureCompleted = (lectureId) => {
    return enrollment?.completedLectures?.includes(lectureId) || false;
  };

  const getNextLecture = () => {
    if (!course?.curriculum || !currentSection || !currentLecture) return null;

    const sectionIndex = course.curriculum.findIndex((s) => s._id === currentSection._id);
    const lectureIndex = currentSection.lectures.findIndex((l) => l._id === currentLecture._id);

    // Next lecture in same section
    if (lectureIndex < currentSection.lectures.length - 1) {
      return {
        lecture: currentSection.lectures[lectureIndex + 1],
        section: currentSection,
      };
    }

    // First lecture of next section
    if (sectionIndex < course.curriculum.length - 1) {
      const nextSection = course.curriculum[sectionIndex + 1];
      if (nextSection.lectures?.length > 0) {
        return {
          lecture: nextSection.lectures[0],
          section: nextSection,
        };
      }
    }

    return null;
  };

  const getPreviousLecture = () => {
    if (!course?.curriculum || !currentSection || !currentLecture) return null;

    const sectionIndex = course.curriculum.findIndex((s) => s._id === currentSection._id);
    const lectureIndex = currentSection.lectures.findIndex((l) => l._id === currentLecture._id);

    // Previous lecture in same section
    if (lectureIndex > 0) {
      return {
        lecture: currentSection.lectures[lectureIndex - 1],
        section: currentSection,
      };
    }

    // Last lecture of previous section
    if (sectionIndex > 0) {
      const prevSection = course.curriculum[sectionIndex - 1];
      if (prevSection.lectures?.length > 0) {
        return {
          lecture: prevSection.lectures[prevSection.lectures.length - 1],
          section: prevSection,
        };
      }
    }

    return null;
  };

  const goToNextLecture = () => {
    const next = getNextLecture();
    if (next) {
      selectLecture(next.lecture, next.section);
      if (!expandedSections.includes(next.section._id)) {
        setExpandedSections((prev) => [...prev, next.section._id]);
      }
    }
  };

  const goToPreviousLecture = () => {
    const prev = getPreviousLecture();
    if (prev) {
      selectLecture(prev.lecture, prev.section);
      if (!expandedSections.includes(prev.section._id)) {
        setExpandedSections((prev) => [...prev, prev.section._id]);
      }
    }
  };

  const saveNotes = () => {
    if (currentLecture) {
      setSavedNotes((prev) => ({
        ...prev,
        [currentLecture._id]: notes,
      }));
      toast.success('تم حفظ الملاحظات! 📝');
    }
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateProgress = () => {
    if (!enrollment || !course?.curriculum) return 0;
    const totalLectures = course.curriculum.reduce(
      (acc, section) => acc + (section.lectures?.length || 0),
      0
    );
    const completedCount = enrollment.completedLectures?.length || 0;
    return totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLecture) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">لا توجد محاضرات متاحة</p>
          <Link to="/courses" className="btn-primary mt-4 inline-block">
            العودة للدورات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Top Bar */}
      <div className="bg-dark-light border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <FiMenu className="text-xl" />
            </button>
            <Link
              to={`/courses/${course.slug}`}
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              ← العودة للدورة
            </Link>
            <h1 className="font-bold text-lg truncate hidden md:block">{course.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-gray-400">
              التقدم: {calculateProgress().toFixed(0)}%
            </div>
            <div className="w-32 h-2 bg-dark rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-gradient-primary transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Curriculum */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed lg:relative top-0 right-0 h-full w-80 bg-dark-light border-l border-white/10 z-40 overflow-y-auto"
            >
              {/* Mobile close button */}
              <div className="lg:hidden sticky top-0 bg-dark-light border-b border-white/10 p-4 flex items-center justify-between">
                <h3 className="font-bold">محتوى الدورة</h3>
                <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {course.curriculum?.map((section, sectionIndex) => (
                  <div key={section._id} className="border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 text-right">
                        <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {sectionIndex + 1}
                        </span>
                        <span className="font-bold text-sm">{section.title}</span>
                      </div>
                      {expandedSections.includes(section._id) ? (
                        <FiChevronUp className="text-gray-400" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </button>

                    {expandedSections.includes(section._id) && (
                      <div className="border-t border-white/10">
                        {section.lectures?.map((lecture, lectureIndex) => {
                          const isCompleted = isLectureCompleted(lecture._id);
                          const isCurrent = currentLecture?._id === lecture._id;

                          return (
                            <button
                              key={lecture._id}
                              onClick={() => selectLecture(lecture, section)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                                isCurrent ? 'bg-primary/10 border-r-2 border-primary' : ''
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isCompleted ? 'bg-success text-white' : 'bg-white/10'
                                }`}
                              >
                                {isCompleted ? (
                                  <FiCheck className="text-xs" />
                                ) : (
                                  <span className="text-xs">{lectureIndex + 1}</span>
                                )}
                              </div>
                              <div className="flex-1 text-right">
                                <p className={`text-sm ${isCurrent ? 'text-primary font-bold' : ''}`}>
                                  {lecture.title}
                                </p>
                                {lecture.duration && (
                                  <p className="text-xs text-gray-400">{lecture.duration} دقيقة</p>
                                )}
                              </div>
                              {isCurrent && (
                                <FiPlay className="text-primary flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="bg-black relative">
            <div className="aspect-video max-h-[70vh] relative">
              <video
                ref={videoRef}
                src={currentLecture.videoUrl || '/sample-video.mp4'}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                  setIsPlaying(false);
                  // Auto mark as complete
                  if (!isLectureCompleted(currentLecture._id)) {
                    markLectureComplete(currentLecture._id);
                  }
                  // Auto play next lecture
                  const next = getNextLecture();
                  if (next) {
                    setTimeout(() => {
                      selectLecture(next.lecture, next.section);
                    }, 1000);
                  }
                }}
              >
                متصفحك لا يدعم تشغيل الفيديو
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 space-y-3">
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                           [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                />

                {/* Controls Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPreviousLecture}
                      disabled={!getPreviousLecture()}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiSkipBack />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? <FiPause /> : <FiPlay className="mr-0.5" />}
                    </button>
                    <button
                      onClick={goToNextLecture}
                      disabled={!getNextLecture()}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiSkipForward />
                    </button>
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={changePlaybackRate}
                      className="px-3 py-1 hover:bg-white/20 rounded-lg transition-colors text-sm"
                    >
                      {playbackRate}x
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hidden sm:block
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 
                                 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full 
                                 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <FiMaximize />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Info & Navigation */}
          <div className="bg-dark-light border-b border-white/10 p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{currentLecture.title}</h2>
                <p className="text-sm text-gray-400">{currentSection?.title}</p>
              </div>
              <button
                onClick={() => markLectureComplete(currentLecture._id)}
                disabled={isLectureCompleted(currentLecture._id)}
                className={`btn-primary flex items-center gap-2 ${
                  isLectureCompleted(currentLecture._id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiCheckCircle />
                {isLectureCompleted(currentLecture._id) ? 'مكتمل' : 'تعليم كمكتمل'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={goToPreviousLecture}
                disabled={!getPreviousLecture()}
                className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiArrowRight />
                المحاضرة السابقة
              </button>
              <button
                onClick={goToNextLecture}
                disabled={!getNextLecture()}
                className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                المحاضرة التالية
                <FiArrowLeft />
              </button>
            </div>
          </div>

          {/* Tabs & Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="bg-dark-light border-b border-white/10 px-4">
              <div className="flex gap-1 overflow-x-auto">
                {[
                  { id: 'overview', label: 'نظرة عامة', icon: FiBookOpen },
                  { id: 'resources', label: 'الموارد', icon: FiDownload },
                  { id: 'notes', label: 'ملاحظاتي', icon: FiFileText },
                  { id: 'qa', label: 'الأسئلة', icon: FiMessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="text-sm" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 max-w-3xl"
                >
                  <h3 className="text-xl font-bold mb-4">وصف المحاضرة</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {currentLecture.description || 'لا يوجد وصف متاح لهذه المحاضرة.'}
                  </p>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold mb-4">الموارد القابلة للتحميل</h3>
                  {currentLecture.resources && currentLecture.resources.length > 0 ? (
                    <div className="space-y-3">
                      {currentLecture.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="glass-card p-4 flex items-center justify-between rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                              <FiDownload className="text-primary" />
                            </div>
                            <div>
                              <p className="font-bold">{resource.title}</p>
                              <p className="text-sm text-gray-400">{resource.type}</p>
                            </div>
                          </div>
                          <a
                            href={resource.url}
                            download
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            تحميل
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">لا توجد موارد متاحة لهذه المحاضرة.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 max-w-3xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">ملاحظاتي الخاصة</h3>
                    <button onClick={saveNotes} className="btn-primary px-4 py-2 text-sm">
                      حفظ الملاحظات
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                             focus:border-primary focus:outline-none resize-none"
                    placeholder="اكتب ملاحظاتك هنا..."
                  />
                  <p className="text-sm text-gray-400">
                    💡 ملاحظاتك محفوظة محلياً في متصفحك
                  </p>
                </motion.div>
              )}

              {activeTab === 'qa' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold mb-4">الأسئلة والأجوبة</h3>
                  <div className="glass-card p-8 text-center rounded-lg">
                    <FiMessageSquare className="text-5xl text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">قريباً - قسم الأسئلة والأجوبة</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default Learning;
