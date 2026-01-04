import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiX, FiClock, FiBarChart, FiStar, 
  FiBookOpen, FiUsers, FiDollarSign, FiGrid, FiList 
} from 'react-icons/fi';
import { coursesAPI, categoriesAPI } from '../api/axios';
import toast from 'react-hot-toast';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ total: 0, free: 0, paid: 0 });

  const levels = [
    { value: 'beginner', label: 'مبتدئ', color: 'success' },
    { value: 'intermediate', label: 'متوسط', color: 'warning' },
    { value: 'advanced', label: 'متقدم', color: 'danger' },
  ];

  const priceOptions = [
    { value: '', label: 'الكل' },
    { value: 'free', label: 'مجاني' },
    { value: 'paid', label: 'مدفوع' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'الأحدث' },
    { value: 'createdAt', label: 'الأقدم' },
    { value: '-rating', label: 'الأعلى تقييماً' },
    { value: '-enrollmentCount', label: 'الأكثر شعبية' },
    { value: 'price', label: 'السعر: من الأقل للأعلى' },
    { value: '-price', label: 'السعر: من الأعلى للأقل' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.price === 'free') params.price = 0;
      if (filters.price === 'paid') params.minPrice = 1;
      if (filters.sort) params.sort = filters.sort;

      const data = await coursesAPI.getAll(params);
      setCourses(data.courses || []);
      
      // Calculate stats
      const total = data.courses?.length || 0;
      const free = data.courses?.filter(c => c.price === 0).length || 0;
      const paid = total - free;
      setStats({ total, free, paid });
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('فشل تحميل الدورات');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      price: '',
      sort: '-createdAt',
    });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.level || filters.price || filters.search;

  const getLevelBadgeColor = (level) => {
    const levelData = levels.find(l => l.value === level);
    return levelData?.color || 'primary';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      {/* Hero Section */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow-primary">
              استكشف الدورات
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              اختر من بين {stats.total} دورة احترافية في مجالات الأمن السيبراني والبرمجة
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="ابحث عن دورة..."
                className="w-full px-12 py-4 rounded-xl bg-dark-light border border-white/10 
                         focus:border-primary focus:outline-none transition-all text-lg"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FiX className="text-xl" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 justify-center mt-8 flex-wrap"
          >
            <div className="glass-card px-6 py-3 rounded-xl">
              <span className="text-gray-400 text-sm">إجمالي الدورات:</span>
              <span className="text-primary font-bold text-xl mr-2">{stats.total}</span>
            </div>
            <div className="glass-card px-6 py-3 rounded-xl">
              <span className="text-gray-400 text-sm">مجاني:</span>
              <span className="text-success font-bold text-xl mr-2">{stats.free}</span>
            </div>
            <div className="glass-card px-6 py-3 rounded-xl">
              <span className="text-gray-400 text-sm">مدفوع:</span>
              <span className="text-accent font-bold text-xl mr-2">{stats.paid}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FiFilter className="text-primary" />
                    الفلاتر
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-danger hover:underline"
                    >
                      مسح الكل
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="glass-card p-4 rounded-xl">
                  <h4 className="font-bold mb-3 text-sm">الفئة</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className={`w-full text-right px-3 py-2 rounded-lg transition-all ${
                        !filters.category 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      الكل
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleFilterChange('category', cat.slug)}
                        className={`w-full text-right px-3 py-2 rounded-lg transition-all ${
                          filters.category === cat.slug 
                            ? 'bg-primary/20 text-primary' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="glass-card p-4 rounded-xl">
                  <h4 className="font-bold mb-3 text-sm">المستوى</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('level', '')}
                      className={`w-full text-right px-3 py-2 rounded-lg transition-all ${
                        !filters.level 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      الكل
                    </button>
                    {levels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => handleFilterChange('level', level.value)}
                        className={`w-full text-right px-3 py-2 rounded-lg transition-all ${
                          filters.level === level.value 
                            ? `bg-${level.color}/20 text-${level.color}` 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="glass-card p-4 rounded-xl">
                  <h4 className="font-bold mb-3 text-sm">السعر</h4>
                  <div className="space-y-2">
                    {priceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('price', option.value)}
                        className={`w-full text-right px-3 py-2 rounded-lg transition-all ${
                          filters.price === option.value 
                            ? 'bg-primary/20 text-primary' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* Top Bar - Sort & View Mode */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-primary flex items-center gap-2"
                >
                  <FiFilter />
                  الفلاتر
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-danger"></span>
                  )}
                </button>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-400">ترتيب:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 rounded-lg bg-dark-light border border-white/10 
                             focus:border-primary focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 glass-card p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400'
                    }`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400'
                    }`}
                  >
                    <FiList />
                  </button>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                      <div className="h-48 bg-white/5 rounded-lg mb-4"></div>
                      <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-white/5 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Courses Grid/List */}
              {!loading && courses.length > 0 && (
                <motion.div
                  layout
                  className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {courses.map((course, index) => (
                      <CourseCard 
                        key={course._id} 
                        course={course} 
                        index={index}
                        viewMode={viewMode}
                        getLevelBadgeColor={getLevelBadgeColor}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* No Results */}
              {!loading && courses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <FiBookOpen className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">لا توجد دورات</h3>
                  <p className="text-gray-400 mb-6">
                    جرب تغيير الفلاتر أو البحث بكلمات أخرى
                  </p>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="btn-primary">
                      مسح الفلاتر
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-80 bg-dark border-l border-white/10 z-50 overflow-y-auto p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">الفلاتر</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-white/5 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Same filter content as sidebar */}
                <div>
                  <h4 className="font-bold mb-3">الفئة</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className={`w-full text-right px-3 py-2 rounded-lg ${
                        !filters.category ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                      }`}
                    >
                      الكل
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleFilterChange('category', cat.slug)}
                        className={`w-full text-right px-3 py-2 rounded-lg ${
                          filters.category === cat.slug ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">المستوى</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('level', '')}
                      className={`w-full text-right px-3 py-2 rounded-lg ${
                        !filters.level ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                      }`}
                    >
                      الكل
                    </button>
                    {levels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => handleFilterChange('level', level.value)}
                        className={`w-full text-right px-3 py-2 rounded-lg ${
                          filters.level === level.value ? `bg-${level.color}/20 text-${level.color}` : 'hover:bg-white/5'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">السعر</h4>
                  <div className="space-y-2">
                    {priceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('price', option.value)}
                        className={`w-full text-right px-3 py-2 rounded-lg ${
                          filters.price === option.value ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearFilters();
                      setShowFilters(false);
                    }}
                    className="w-full btn-danger"
                  >
                    مسح جميع الفلاتر
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, index, viewMode, getLevelBadgeColor }) => {
  const levelLabels = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/courses/${course.slug}`}>
          <div className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all group">
            <div className="flex gap-6">
              {/* Image */}
              <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={course.thumbnail || '/default-course.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getLevelBadgeColor(course.level)}/20 text-${getLevelBadgeColor(course.level)}`}>
                    {levelLabels[course.level]}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.shortDescription}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-primary" />
                    <span>{course.enrollmentCount || 0} طالب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-primary" />
                    <span>{course.duration || 0} ساعة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiStar className="text-warning fill-warning" />
                    <span>{course.rating || 0} ({course.reviewCount || 0})</span>
                  </div>
                  <div className="mr-auto">
                    <span className="text-2xl font-bold text-primary">
                      {course.price === 0 ? 'مجاني' : `$${course.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/courses/${course.slug}`}>
        <div className="glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all group h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.thumbnail || '/default-course.jpg'}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getLevelBadgeColor(course.level)}/90 text-white backdrop-blur-sm`}>
                {levelLabels[course.level]}
              </span>
            </div>
            {course.price === 0 && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/90 text-white backdrop-blur-sm">
                  مجاني
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {course.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
              {course.shortDescription}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <FiUsers className="text-primary" />
                <span>{course.enrollmentCount || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <FiClock className="text-primary" />
                <span>{course.duration || 0}س</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <FiStar className="text-warning fill-warning" />
                <span>{course.rating || 0}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-2xl font-bold text-primary">
                {course.price === 0 ? 'مجاني' : `$${course.price}`}
              </span>
              <span className="text-sm text-gray-400">
                {course.reviewCount || 0} تقييم
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Courses;
