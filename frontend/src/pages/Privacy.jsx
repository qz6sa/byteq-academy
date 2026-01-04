import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiShield, FiLock, FiCheckCircle } from 'react-icons/fi';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'intro', title: 'مقدمة' },
    { id: 'collection', title: 'المعلومات التي نجمعها' },
    { id: 'usage', title: 'كيف نستخدم معلوماتك' },
    { id: 'sharing', title: 'مشاركة المعلومات' },
    { id: 'security', title: 'أمن المعلومات' },
    { id: 'rights', title: 'حقوقك' },
    { id: 'cookies', title: 'ملفات تعريف الارتباط' },
    { id: 'children', title: 'الأطفال' },
    { id: 'updates', title: 'التحديثات' },
    { id: 'contact', title: 'تواصل معنا' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      <div className="relative z-10">
        {/* Hero */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FiShield className="text-6xl text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-glow-primary">
                سياسة الخصوصية
              </h1>
              <p className="text-gray-400 mb-2">آخر تحديث: يناير 2026</p>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                نحن في ByTeq نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              
              {/* Sidebar - Table of Contents */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 glass-card p-6">
                  <h3 className="font-bold mb-4 text-primary">المحتويات</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-right px-3 py-2 rounded transition-all ${
                          activeSection === section.id
                            ? 'bg-primary/20 text-primary font-bold'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 glass-card p-8 md:p-12 space-y-12">
                
                {/* 1. مقدمة */}
                <div id="intro">
                  <h2 className="text-3xl font-bold mb-4 text-primary">1. مقدمة</h2>
                  <p className="text-gray-300 leading-relaxed">
                    نحن في ByTeq نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك عند استخدامك لمنصتنا التعليمية. باستخدامك لـ ByTeq، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة.
                  </p>
                </div>

                {/* 2. المعلومات التي نجمعها */}
                <div id="collection">
                  <h2 className="text-3xl font-bold mb-6 text-primary">2. المعلومات التي نجمعها</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-secondary">2.1 المعلومات التي تقدمها لنا:</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                          <span><strong>معلومات الحساب:</strong> الاسم، البريد الإلكتروني، كلمة المرور (مشفرة)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                          <span><strong>معلومات الملف الشخصي:</strong> الصورة، السيرة، رقم الهاتف، البلد</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                          <span><strong>معلومات الدفع:</strong> نستخدم معالجات خارجية آمنة، ولا نخزن بيانات بطاقتك الائتمانية</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3 text-secondary">2.2 المعلومات التي نجمعها تلقائياً:</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                          <span><strong>بيانات الاستخدام:</strong> الصفحات المزارة، الوقت المستغرق، الدورات المشاهدة، التقدم الدراسي</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                          <span><strong>المعلومات التقنية:</strong> عنوان IP، نوع المتصفح، نظام التشغيل، الجهاز المستخدم</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                          <span><strong>ملفات تعريف الارتباط (Cookies):</strong> لتحسين تجربتك وتذكر تفضيلاتك</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. كيف نستخدم معلوماتك */}
                <div id="usage">
                  <h2 className="text-3xl font-bold mb-4 text-primary">3. كيف نستخدم معلوماتك</h2>
                  <p className="text-gray-300 mb-4">نستخدم المعلومات المجمعة للأغراض التالية:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>تقديم الخدمة:</strong> إنشاء وإدارة حسابك، تسجيلك في الدورات، تتبع تقدمك</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>تحسين التجربة:</strong> تخصيص المحتوى، تحسين المنصة، تطوير ميزات جديدة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>التواصل:</strong> إرسال إشعارات مهمة، رسائل بريدية، دعم فني</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>الأمان:</strong> حماية المنصة من الاحتيال والاختراقات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>التحليل:</strong> فهم استخدام المنصة لتحسين الخدمات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>الامتثال القانوني:</strong> الوفاء بالالتزامات القانونية</span>
                    </li>
                  </ul>
                </div>

                {/* 4. مشاركة المعلومات */}
                <div id="sharing">
                  <h2 className="text-3xl font-bold mb-4 text-primary">4. مشاركة المعلومات</h2>
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-6 mb-4">
                    <p className="text-warning font-bold text-lg">⚠️ لا نبيع معلوماتك الشخصية أبداً.</p>
                  </div>
                  <p className="text-gray-300 mb-4">قد نشارك معلوماتك فقط في الحالات التالية:</p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <FiLock className="text-primary mt-1 flex-shrink-0" />
                      <span><strong>مقدمو الخدمات الموثوقين:</strong> شركات الاستضافة، معالجات الدفع، أدوات التحليل (ملتزمون بحماية بياناتك)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiLock className="text-primary mt-1 flex-shrink-0" />
                      <span><strong>المتطلبات القانونية:</strong> عند الطلب القانوني من السلطات المختصة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiLock className="text-primary mt-1 flex-shrink-0" />
                      <span><strong>حماية الحقوق:</strong> لحماية حقوقنا وسلامة المستخدمين</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiLock className="text-primary mt-1 flex-shrink-0" />
                      <span><strong>بموافقتك:</strong> في أي حالات أخرى بعد الحصول على موافقتك الصريحة</span>
                    </li>
                  </ul>
                </div>

                {/* 5. أمن المعلومات */}
                <div id="security">
                  <h2 className="text-3xl font-bold mb-4 text-primary">5. أمن المعلومات</h2>
                  <p className="text-gray-300 mb-4">نطبق إجراءات أمنية صارمة لحماية معلوماتك:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🔒</span>
                        <strong className="text-white">تشفير البيانات</strong>
                      </div>
                      <p className="text-sm text-gray-400">SSL/TLS لجميع عمليات النقل</p>
                    </div>
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🔐</span>
                        <strong className="text-white">تشفير كلمات المرور</strong>
                      </div>
                      <p className="text-sm text-gray-400">باستخدام خوارزمية bcrypt</p>
                    </div>
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">👮</span>
                        <strong className="text-white">الوصول المحدود</strong>
                      </div>
                      <p className="text-sm text-gray-400">فقط الموظفون المصرح لهم</p>
                    </div>
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📊</span>
                        <strong className="text-white">مراقبة مستمرة</strong>
                      </div>
                      <p className="text-sm text-gray-400">كشف التهديدات الأمنية</p>
                    </div>
                  </div>
                </div>

                {/* 6. حقوقك */}
                <div id="rights">
                  <h2 className="text-3xl font-bold mb-4 text-primary">6. حقوقك</h2>
                  <p className="text-gray-300 mb-4">لديك الحقوق التالية بشأن بياناتك الشخصية:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>الوصول:</strong> طلب نسخة من بياناتك</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>التصحيح:</strong> تحديث أو تصحيح بياناتك</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>الحذف:</strong> طلب حذف بياناتك</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>الاعتراض:</strong> الاعتراض على معالجة معينة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>نقل البيانات:</strong> الحصول على بياناتك بصيغة قابلة للنقل</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">✅</span>
                      <span><strong>إلغاء الموافقة:</strong> سحب موافقتك في أي وقت</span>
                    </li>
                  </ul>
                  <div className="mt-4 glass-card p-4 bg-primary/10">
                    <p className="text-gray-300">
                      لممارسة أي من هذه الحقوق، راسلنا على: <strong className="text-primary">privacy@byteq.academy</strong>
                    </p>
                  </div>
                </div>

                {/* 7. ملفات تعريف الارتباط */}
                <div id="cookies">
                  <h2 className="text-3xl font-bold mb-4 text-primary">7. ملفات تعريف الارتباط (Cookies)</h2>
                  <p className="text-gray-300 mb-4">نستخدم ملفات تعريف الارتباط لـ:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• تذكر تسجيل دخولك وتفضيلاتك</li>
                    <li>• حفظ إعدادات اللغة والمظهر</li>
                    <li>• تحليل استخدام المنصة وتحسين الأداء</li>
                    <li>• توفير محتوى مخصص</li>
                  </ul>
                  <p className="text-gray-400 text-sm mt-4">
                    يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.
                  </p>
                </div>

                {/* 8. الأطفال */}
                <div id="children">
                  <h2 className="text-3xl font-bold mb-4 text-primary">8. الأطفال</h2>
                  <p className="text-gray-300">
                    منصتنا ليست موجهة للأطفال دون 13 عاماً. لا نجمع معلومات شخصية عن قصد من الأطفال دون هذا السن. إذا علمنا بجمع معلومات من طفل دون 13 عاماً، سنحذفها فوراً.
                  </p>
                </div>

                {/* 9. التحديثات */}
                <div id="updates">
                  <h2 className="text-3xl font-bold mb-4 text-primary">9. التحديثات</h2>
                  <p className="text-gray-300">
                    قد نحدث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية. سنعلمك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة. التاريخ في أعلى الصفحة يوضح آخر تحديث.
                  </p>
                </div>

                {/* 10. تواصل معنا */}
                <div id="contact">
                  <h2 className="text-3xl font-bold mb-4 text-primary">10. تواصل معنا</h2>
                  <p className="text-gray-300 mb-4">
                    إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه، يرجى التواصل معنا:
                  </p>
                  <div className="glass-card p-6 bg-primary/10">
                    <p className="text-lg">
                      📧 <strong>البريد الإلكتروني:</strong> <span className="text-primary">privacy@byteq.academy</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
