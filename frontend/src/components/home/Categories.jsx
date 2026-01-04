import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categoriesAPI } from '../../api/axios';
import Card from '../common/Card';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = ['🐍', '🌐', '🔐', '🐧', '🎯', '💻', '🛡️', '🔒'];
  const categoryGradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
  ];

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-glow-primary">تصفح</span> التصنيفات
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            اختر المجال الذي يناسبك وابدأ رحلتك التعليمية معنا
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories && categories.length > 0 ? categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/courses?category=${category.slug}`}>
                <Card className="h-full cursor-pointer group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {categoryIcons[index % categoryIcons.length]}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {category.coursesCount} دورة
                    </span>
                    <span className="text-primary group-hover:translate-x-2 transition-transform">
                      ←
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">لا توجد تصنيفات متاحة حالياً</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
