import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiFileText } from 'react-icons/fi';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'acceptance', title: 'القبول بالشروط' },
    { id: 'definitions', title: 'التعريفات' },
    { id: 'eligibility', title: 'الأهلية' },
    { id: 'account', title: 'الحساب' },
    { id: 'subscriptions', title: 'الاشتراكات والدفع' },
    { id: 'access', title: 'الوصول للمحتوى' },
    { id: 'intellectual', title: 'حقوق الملكية الفكرية' },
    { id: 'conduct', title: 'سلوك المستخدم' },
    { id: 'disclaimer', title: 'إخلاء المسؤولية' },
    { id: 'liability', title: 'تحديد المسؤولية' },
    { id: 'indemnification', title: 'التعويض' },
    { id: 'termination', title: 'إنهاء الخدمة' },
    { id: 'changes', title: 'التعديلات' },
    { id: 'law', title: 'القانون الحاكم' },
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
              <FiFileText className="text-6xl text-secondary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-glow-secondary">
                الشروط والأحكام
              </h1>
              <p className="text-gray-400 mb-2">آخر تحديث: يناير 2026</p>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                يرجى قراءة هذه الشروط بعناية قبل استخدام منصة ByTeq
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              
              {/* Sidebar */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 glass-card p-6">
                  <h3 className="font-bold mb-4 text-secondary">المحتويات</h3>
                  <nav className="space-y-2 max-h-[70vh] overflow-y-auto">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-right px-3 py-2 rounded transition-all text-sm ${
                          activeSection === section.id
                            ? 'bg-secondary/20 text-secondary font-bold'
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
                
                <div id="acceptance">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">1. القبول بالشروط</h2>
                  <p className="text-gray-300">
                    باستخدامك لمنصة ByTeq ("المنصة")، أنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.
                  </p>
                </div>

                <div id="definitions">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">2. التعريفات</h2>
                  <ul className="space-y-2 text-gray-300">
                    <li><strong className="text-white">"المنصة" أو "الموقع":</strong> byteq.academy وجميع الخدمات المرتبطة</li>
                    <li><strong className="text-white">"نحن" أو "ByTeq":</strong> القائمون على إدارة وتشغيل المنصة</li>
                    <li><strong className="text-white">"المستخدم" أو "أنت":</strong> أي شخص يصل إلى المنصة أو يستخدمها</li>
                    <li><strong className="text-white">"المحتوى":</strong> جميع الدورات، الفيديوهات، المواد التعليمية، والموارد</li>
                    <li><strong className="text-white">"الخدمات":</strong> جميع الخدمات التعليمية والتقنية المقدمة عبر المنصة</li>
                  </ul>
                </div>

                <div id="eligibility">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">3. الأهلية</h2>
                  <p className="text-gray-300 mb-3">لاستخدام المنصة، يجب أن:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• تكون بعمر 13 عاماً على الأقل</li>
                    <li>• تقدم معلومات صحيحة ودقيقة</li>
                    <li>• لا تنتهك أي قوانين محلية أو دولية</li>
                  </ul>
                </div>

                <div id="account">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">4. الحساب</h2>
                  
                  <h3 className="text-xl font-bold mb-3 text-white">4.1 إنشاء الحساب</h3>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li>• أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور</li>
                    <li>• يجب عليك اختيار كلمة مرور قوية وآمنة</li>
                    <li>• عدم مشاركة بيانات الدخول مع الآخرين</li>
                    <li>• إخطارنا فوراً بأي استخدام غير مصرح به</li>
                  </ul>

                  <h3 className="text-xl font-bold mb-3 text-white">4.2 إيقاف الحساب</h3>
                  <p className="text-gray-300">
                    نحتفظ بالحق في إيقاف أو إنهاء حسابك إذا انتهكت هذه الشروط، قدمت معلومات كاذبة، أو شاركت في أنشطة احتيالية.
                  </p>
                </div>

                <div id="subscriptions">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">5. الاشتراكات والدفع</h2>
                  
                  <h3 className="text-xl font-bold mb-3 text-white">5.1 الأسعار</h3>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li>• جميع الأسعار معروضة بوضوح على المنصة</li>
                    <li>• نحتفظ بالحق في تغيير الأسعار في أي وقت</li>
                    <li>• تغييرات الأسعار لا تؤثر على المشتريات السابقة</li>
                  </ul>

                  <h3 className="text-xl font-bold mb-3 text-white">5.2 الدفع</h3>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li>• نستخدم معالجات دفع آمنة ومعتمدة</li>
                    <li>• جميع المبيعات نهائية ما لم ينص على خلاف ذلك</li>
                    <li>• تخضع المعاملات لشروط معالج الدفع</li>
                  </ul>

                  <h3 className="text-xl font-bold mb-3 text-white">5.3 الاسترجاع</h3>
                  <p className="text-gray-300">
                    نوفر ضمان استرجاع المبلغ خلال 14 يوماً من الشراء بشرط عدم إكمال أكثر من 30% من الدورة. يستغرق معالجة الاسترجاع 5-10 أيام عمل.
                  </p>
                </div>

                <div id="access">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">6. الوصول للمحتوى</h2>
                  
                  <h3 className="text-xl font-bold mb-3 text-white">6.1 الترخيص</h3>
                  <p className="text-gray-300 mb-3">
                    نمنحك ترخيصاً محدوداً، غير حصري، غير قابل للنقل، وقابل للإلغاء للوصول واستخدام المحتوى لأغراض تعليمية شخصية فقط.
                  </p>

                  <h3 className="text-xl font-bold mb-3 text-white">6.2 القيود</h3>
                  <p className="text-gray-300 mb-2">ممنوع منعاً باتاً:</p>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li>❌ نسخ أو تحميل المحتوى بدون إذن</li>
                    <li>❌ مشاركة حسابك أو بيانات الدخول</li>
                    <li>❌ إعادة بيع أو توزيع المحتوى</li>
                    <li>❌ استخدام المحتوى لأغراض تجارية</li>
                    <li>❌ تعديل أو فك تشفير المحتوى</li>
                  </ul>

                  <h3 className="text-xl font-bold mb-3 text-white">6.3 مدة الوصول</h3>
                  <p className="text-gray-300">
                    الدورات المدفوعة: وصول مدى الحياة طالما المنصة نشطة<br/>
                    الدورات المجانية: قد نحد الوصول في المستقبل
                  </p>
                </div>

                <div id="intellectual">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">7. حقوق الملكية الفكرية</h2>
                  <p className="text-gray-300">
                    جميع المحتويات والموارد على المنصة (فيديوهات، نصوص، شعارات، تصاميم، كود، إلخ) هي ملكية حصرية لـ ByTeq أو مرخصيها وتخضع لقوانين حقوق النشر والملكية الفكرية الدولية.
                  </p>
                </div>

                <div id="conduct">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">8. سلوك المستخدم</h2>
                  
                  <h3 className="text-xl font-bold mb-3 text-success">يُسمح بـ:</h3>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li>✅ التعلم والاستفادة من المحتوى</li>
                    <li>✅ المشاركة البناءة في المجتمع</li>
                    <li>✅ كتابة تقييمات صادقة</li>
                  </ul>

                  <h3 className="text-xl font-bold mb-3 text-danger">ممنوع منعاً باتاً:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>❌ التحرش أو الإساءة للآخرين</li>
                    <li>❌ نشر محتوى غير قانوني أو مسيء</li>
                    <li>❌ الاحتيال أو انتحال الشخصية</li>
                    <li>❌ محاولة اختراق المنصة</li>
                    <li>❌ إرسال برمجيات خبيثة أو فيروسات</li>
                  </ul>
                </div>

                <div id="disclaimer">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">9. إخلاء المسؤولية</h2>
                  <p className="text-gray-300">
                    الخدمة مقدمة "كما هي" و"حسب التوفر" بدون أي ضمانات صريحة أو ضمنية. لا نضمن أن المنصة ستكون خالية من الأخطاء أو متوفرة دائماً. المحتوى التعليمي مقدم لأغراض تعليمية فقط ولا يشكل نصيحة مهنية معتمدة.
                  </p>
                </div>

                <div id="liability">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">10. تحديد المسؤولية</h2>
                  <p className="text-gray-300">
                    لن نكون مسؤولين عن أي أضرار غير مباشرة، عرضية، خاصة، أو تبعية ناتجة عن استخدامك للمنصة. مسؤوليتنا القصوى محدودة بالمبلغ الذي دفعته خلال الـ 12 شهراً السابقة.
                  </p>
                </div>

                <div id="indemnification">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">11. التعويض</h2>
                  <p className="text-gray-300">
                    توافق على تعويضنا والدفاع عنا ضد أي مطالبات أو دعاوى أو أضرار أو خسائر ناتجة عن انتهاكك لهذه الشروط أو استخدامك غير القانوني للمنصة.
                  </p>
                </div>

                <div id="termination">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">12. إنهاء الخدمة</h2>
                  
                  <h3 className="text-xl font-bold mb-3 text-white">12.1 حقك</h3>
                  <p className="text-gray-300 mb-4">يمكنك إنهاء حسابك وحذفه في أي وقت من إعدادات الحساب.</p>

                  <h3 className="text-xl font-bold mb-3 text-white">12.2 حقنا</h3>
                  <p className="text-gray-300">
                    نحتفظ بالحق في إيقاف أو إنهاء وصولك للمنصة فوراً وبدون إشعار مسبق إذا انتهكت هذه الشروط أو شاركت في أي نشاط ضار.
                  </p>
                </div>

                <div id="changes">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">13. التعديلات</h2>
                  <p className="text-gray-300">
                    نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنعلمك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة. استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك عليها.
                  </p>
                </div>

                <div id="law">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">14. القانون الحاكم</h2>
                  <p className="text-gray-300">
                    تخضع هذه الشروط وتُفسر وفقاً لقوانين الأردن، بدون الإخلال بأحكام تنازع القوانين.
                  </p>
                </div>

                <div id="contact">
                  <h2 className="text-3xl font-bold mb-4 text-secondary">15. تواصل معنا</h2>
                  <p className="text-gray-300 mb-4">
                    لأي أسئلة حول هذه الشروط والأحكام:
                  </p>
                  <div className="glass-card p-6 bg-secondary/10">
                    <p className="text-lg">
                      📧 <strong>البريد الإلكتروني:</strong> <span className="text-secondary">legal@byteq.academy</span>
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

export default Terms;
