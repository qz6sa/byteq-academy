import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiInfo, FiList, FiEye, FiArrowRight, FiArrowLeft, FiSave,
  FiPlus, FiTrash2, FiMove
} from 'react-icons/fi';
import { adminCoursesAPI, categoriesAPI } from '../../api/axios';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: '',
    level: 'beginner',
    language: 'arabic',
    price: 0,
    isFree: true,
    thumbnail: '',
    duration: 0,
    requirements: [''],
    whatYouWillLearn: [''],
    isPublished: true,
  });

  const [sections, setSections] = useState([
    {
      title: '',
      description: '',
      order: 1,
      lectures: [
        {
          title: '',
          description: '',
          youtubeUrl: '',
          duration: 0,
          order: 1,
          isFree: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchCourse();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('فشل تحميل التصنيفات');
    }
  };

  const fetchCourse = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching course with ID:', id);
      const response = await adminCoursesAPI.getById(id);
      console.log('✅ Course fetched:', response);
      const course = response.data;
      
      setFormData({
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || '',
        description: course.description,
        category: course.category?._id || '',
        level: course.level,
        language: course.language || 'arabic',
        price: course.price,
        isFree: course.isFree,
        thumbnail: course.thumbnail || '',
        duration: course.duration || 0,
        requirements: course.requirements || [''],
        whatYouWillLearn: course.whatYouWillLearn || [''],
        isPublished: course.isPublished || false,
      });

      if (course.sections && course.sections.length > 0) {
        setSections(course.sections);
      }
    } catch (error) {
      console.error('❌ Error fetching course:', error);
      console.error('❌ Error response:', error.response);
      toast.error('فشل تحميل بيانات الدورة');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // Section & Lecture Management
  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        description: '',
        order: sections.length + 1,
        lectures: [
          {
            title: '',
            description: '',
            youtubeUrl: '',
            duration: 0,
            order: 1,
            isFree: false,
          },
        ],
      },
    ]);
  };

  const removeSection = (sectionIndex) => {
    setSections(sections.filter((_, i) => i !== sectionIndex));
  };

  const updateSection = (sectionIndex, field, value) => {
    const newSections = [...sections];
    newSections[sectionIndex][field] = value;
    setSections(newSections);
  };

  const addLecture = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures.push({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: 0,
      order: newSections[sectionIndex].lectures.length + 1,
      isFree: false,
    });
    setSections(newSections);
  };

  const removeLecture = (sectionIndex, lectureIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures = newSections[sectionIndex].lectures.filter(
      (_, i) => i !== lectureIndex
    );
    setSections(newSections);
  };

  const updateLecture = (sectionIndex, lectureIndex, field, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].lectures[lectureIndex][field] = value;
    setSections(newSections);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const courseData = {
        ...formData,
        requirements: formData.requirements.filter(r => r.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(w => w.trim()),
        sections: sections.map((section, sIndex) => ({
          ...section,
          order: sIndex + 1,
          lectures: section.lectures.map((lecture, lIndex) => ({
            ...lecture,
            order: lIndex + 1,
          })),
        })),
      };

      console.log('📤 Sending course data:', courseData);

      if (isEditMode) {
        const response = await adminCoursesAPI.update(id, courseData);
        console.log('✅ Course updated:', response);
        toast.success('تم تحديث الدورة بنجاح');
      } else {
        const response = await adminCoursesAPI.create(courseData);
        console.log('✅ Course created:', response);
        toast.success('تم إنشاء الدورة بنجاح');
      }

      navigate('/admin/courses');
    } catch (error) {
      console.error('❌ Error saving course:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'فشل حفظ الدورة');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'المعلومات الأساسية', icon: <FiInfo /> },
    { number: 2, title: 'المنهج الدراسي', icon: <FiList /> },
    { number: 3, title: 'المراجعة والنشر', icon: <FiEye /> },
  ];

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-glow-primary">
            {isEditMode ? 'تعديل الدورة' : 'إنشاء دورة جديدة'}
          </span>
        </h1>
        <p className="text-gray-400">
          {isEditMode ? 'تعديل معلومات الدورة' : 'أضف دورة تدريبية جديدة للمنصة'}
        </p>
      </div>

      {/* Steps */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-br from-primary to-cyan-400 text-white'
                      : 'glass-card text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">الخطوة {step.number}</p>
                  <p className="font-semibold">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card space-y-6"
          >
            <h2 className="text-2xl font-bold text-glow-secondary">
              المعلومات الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  عنوان الدورة *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-glass w-full"
                  placeholder="مثال: دورة الأمن السيبراني الشاملة"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  الوصف القصير * (160 حرف كحد أقصى)
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  maxLength={160}
                  className="input-glass w-full"
                  placeholder="وصف قصير يظهر في قائمة الدورات..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.shortDescription.length}/160 حرف
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  الوصف الكامل *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="input-glass w-full"
                  placeholder="وصف تفصيلي للدورة..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  التصنيف *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-glass w-full"
                  required
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  المستوى *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="input-glass w-full"
                  required
                >
                  <option value="beginner">مبتدئ</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  اللغة *
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="input-glass w-full"
                  required
                >
                  <option value="arabic">العربية</option>
                  <option value="english">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  المدة (ساعات)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input-glass w-full"
                  placeholder="مثال: 40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="input-glass w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-white/20"
                />
                <label htmlFor="isFree" className="text-sm font-medium">
                  دورة مجانية
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    السعر ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-glass w-full"
                    placeholder="مثال: 99"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-white/20"
                />
                <label htmlFor="isPublished" className="text-sm font-medium">
                  نشر الدورة مباشرة
                </label>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium mb-2">
                المتطلبات
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleArrayChange('requirements', index, e.target.value)
                    }
                    className="input-glass flex-1"
                    placeholder="مثال: معرفة أساسية بالبرمجة"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeArrayItem('requirements', index)}
                      icon={<FiTrash2 />}
                    />
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('requirements')}
                icon={<FiPlus />}
              >
                إضافة متطلب
              </Button>
            </div>

            {/* What You Will Learn */}
            <div>
              <label className="block text-sm font-medium mb-2">
                ماذا ستتعلم
              </label>
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange('whatYouWillLearn', index, e.target.value)
                    }
                    className="input-glass flex-1"
                    placeholder="مثال: أساسيات الأمن السيبراني"
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeArrayItem('whatYouWillLearn', index)}
                      icon={<FiTrash2 />}
                    />
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('whatYouWillLearn')}
                icon={<FiPlus />}
              >
                إضافة هدف
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-glow-secondary mb-6">
                المنهج الدراسي
              </h2>

              {sections.map((section, sIndex) => (
                <div key={sIndex} className="glass-card mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      القسم {sIndex + 1}
                    </h3>
                    {sections.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeSection(sIndex)}
                        icon={<FiTrash2 />}
                      >
                        حذف القسم
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(sIndex, 'title', e.target.value)
                      }
                      className="input-glass w-full"
                      placeholder="عنوان القسم"
                    />

                    <textarea
                      value={section.description}
                      onChange={(e) =>
                        updateSection(sIndex, 'description', e.target.value)
                      }
                      rows={2}
                      className="input-glass w-full"
                      placeholder="وصف القسم (اختياري)"
                    />

                    {/* Lectures */}
                    <div className="space-y-3">
                      <p className="font-semibold text-gray-300">الدروس:</p>
                      {section.lectures.map((lecture, lIndex) => (
                        <div key={lIndex} className="bg-white/5 p-4 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                              الدرس {lIndex + 1}
                            </p>
                            {section.lectures.length > 1 && (
                              <button
                                onClick={() => removeLecture(sIndex, lIndex)}
                                className="text-red-500 hover:text-red-400"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            value={lecture.title}
                            onChange={(e) =>
                              updateLecture(sIndex, lIndex, 'title', e.target.value)
                            }
                            className="input-glass w-full"
                            placeholder="عنوان الدرس"
                          />

                          <textarea
                            value={lecture.description}
                            onChange={(e) =>
                              updateLecture(sIndex, lIndex, 'description', e.target.value)
                            }
                            rows={2}
                            className="input-glass w-full"
                            placeholder="وصف الدرس (اختياري)"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="url"
                              value={lecture.youtubeUrl}
                              onChange={(e) =>
                                updateLecture(sIndex, lIndex, 'youtubeUrl', e.target.value)
                              }
                              className="input-glass"
                              placeholder="رابط الفيديو (YouTube)"
                              required
                            />

                            <input
                              type="number"
                              value={lecture.duration}
                              onChange={(e) =>
                                updateLecture(
                                  sIndex,
                                  lIndex,
                                  'duration',
                                  Number(e.target.value)
                                )
                              }
                              className="input-glass"
                              placeholder="المدة (دقائق)"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`lecture-free-${sIndex}-${lIndex}`}
                              checked={lecture.isFree}
                              onChange={(e) =>
                                updateLecture(sIndex, lIndex, 'isFree', e.target.checked)
                              }
                              className="w-4 h-4"
                            />
                            <label htmlFor={`lecture-free-${sIndex}-${lIndex}`} className="text-sm">
                              درس مجاني (معاينة)
                            </label>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLecture(sIndex)}
                        icon={<FiPlus />}
                      >
                        إضافة درس
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="primary"
                onClick={addSection}
                icon={<FiPlus />}
              >
                إضافة قسم جديد
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card space-y-6"
          >
            <h2 className="text-2xl font-bold text-glow-secondary">
              المراجعة والنشر
            </h2>

            {/* Course Summary */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
                <p className="text-gray-400">{formData.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card">
                  <p className="text-sm text-gray-400">التصنيف</p>
                  <p className="font-semibold">
                    {categories.find((c) => c._id === formData.category)?.name || '-'}
                  </p>
                </div>
                <div className="glass-card">
                  <p className="text-sm text-gray-400">المستوى</p>
                  <p className="font-semibold">
                    {formData.level === 'beginner' ? 'مبتدئ' : 
                     formData.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                  </p>
                </div>
                <div className="glass-card">
                  <p className="text-sm text-gray-400">السعر</p>
                  <p className="font-semibold">
                    {formData.isFree ? 'مجاني' : `$${formData.price}`}
                  </p>
                </div>
                <div className="glass-card">
                  <p className="text-sm text-gray-400">الأقسام</p>
                  <p className="font-semibold">{sections.length} قسم</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2">المحتوى:</h4>
                {sections.map((section, index) => (
                  <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                    <p className="font-semibold">{section.title}</p>
                    <p className="text-sm text-gray-400">
                      {section.lectures.length} درس
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between glass-card">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          icon={<FiArrowRight />}
        >
          السابق
        </Button>

        {currentStep < 3 ? (
          <Button
            variant="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
            icon={<FiArrowLeft />}
            iconPosition="left"
          >
            التالي
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            icon={<FiSave />}
          >
            {isEditMode ? 'حفظ التغييرات' : 'نشر الدورة'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
