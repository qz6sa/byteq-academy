/**
 * افتح MongoDB Compass وشغل هذا الأمر في Shell
 */

// حذف جميع الدورات
db.courses.deleteMany({})

// حذف جميع الأقسام  
db.sections.deleteMany({})

// حذف جميع المحاضرات
db.lectures.deleteMany({})

// التأكد من الحذف
console.log('Courses:', db.courses.countDocuments())
console.log('Sections:', db.sections.countDocuments())
console.log('Lectures:', db.lectures.countDocuments())
