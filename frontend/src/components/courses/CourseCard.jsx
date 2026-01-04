import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { FiClock, FiBarChart2, FiStar, FiUsers } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  const levelColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
  };

  const levelNames = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  };

  return (
    <Link to={`/courses/${course.slug}`}>
      <Card className="h-full overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden rounded-lg mb-4">
          <img
            src={course.thumbnail || '/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {course.isFree ? (
            <span className="absolute top-3 right-3 badge badge-success">مجاني</span>
          ) : (
            <span className="absolute top-3 right-3 badge badge-primary">
              ${course.price}
            </span>
          )}
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level]} text-white`}>
            {levelNames[course.level]}
          </span>
        </div>

        {/* Content */}
        <div>
          {/* Category */}
          <p className="text-sm text-primary mb-2">{course.category?.name}</p>

          {/* Title */}
          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
            <img
              src={course.instructor?.avatar || '/default-avatar.png'}
              alt={course.instructor?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-400">{course.instructor?.name}</span>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <FiClock className="text-primary" />
              <span>{course.duration || 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FiUsers className="text-primary" />
              <span>{course.studentsCount} طالب</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FiBarChart2 className="text-primary" />
              <span>{levelNames[course.level]}</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <FiStar className="fill-yellow-500" />
              <span>{course.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
