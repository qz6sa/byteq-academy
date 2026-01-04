const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Section = require('../models/Section');

/**
 * حساب نسبة إنجاز الدورة
 * @param {ObjectId} enrollmentId - معرف التسجيل
 * @returns {Object} - التقدم المحدّث
 */
exports.calculateCourseProgress = async (enrollmentId) => {
  try {
    const enrollment = await Enrollment.findById(enrollmentId).populate(
      'courseId'
    );

    if (!enrollment) {
      throw new Error('التسجيل غير موجود');
    }

    // جلب جميع الدروس في الدورة
    const totalLectures = await Lecture.countDocuments({
      courseId: enrollment.courseId._id,
    });

    if (totalLectures === 0) {
      return {
        overallProgress: 0,
        completedLectures: 0,
        totalLectures: 0,
      };
    }

    // حساب الدروس المكتملة
    const completedLectures = enrollment.progress.filter(
      (p) => p.completed
    ).length;

    // حساب النسبة المئوية
    const overallProgress = Math.round(
      (completedLectures / totalLectures) * 100
    );

    // تحديث التسجيل
    enrollment.overallProgress = overallProgress;
    enrollment.completedLectures = completedLectures;
    enrollment.lastAccessedAt = Date.now();

    // إذا اكتمل 100% وضع تاريخ الإكمال
    if (overallProgress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = Date.now();
    }

    await enrollment.save();

    return {
      overallProgress,
      completedLectures,
      totalLectures,
      isCompleted: overallProgress === 100,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * تحديث إحصائيات الدورة (المدة الكلية، عدد الدروس، إلخ)
 * @param {ObjectId} courseId - معرف الدورة
 */
exports.updateCourseStats = async (courseId) => {
  try {
    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error('الدورة غير موجودة');
    }

    // عدد الأقسام
    const totalSections = await Section.countDocuments({ courseId });

    // عدد الدروس
    const totalLectures = await Lecture.countDocuments({ courseId });

    // المدة الكلية
    const lectures = await Lecture.find({ courseId }).select('duration');
    const totalDuration = lectures.reduce(
      (sum, lecture) => sum + lecture.duration,
      0
    );

    // تحديث الدورة
    course.totalSections = totalSections;
    course.totalLectures = totalLectures;
    course.totalDuration = totalDuration;

    await course.save();

    return {
      totalSections,
      totalLectures,
      totalDuration,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * تحديث مدة القسم
 * @param {ObjectId} sectionId - معرف القسم
 */
exports.updateSectionStats = async (sectionId) => {
  try {
    const section = await Section.findById(sectionId);

    if (!section) {
      throw new Error('القسم غير موجود');
    }

    // جلب جميع الدروس في القسم
    const lectures = await Lecture.find({ sectionId }).select('duration');

    // حساب المدة الكلية
    const totalDuration = lectures.reduce(
      (sum, lecture) => sum + lecture.duration,
      0
    );

    // تحديث القسم
    section.totalDuration = totalDuration;
    section.totalLectures = lectures.length;

    await section.save();

    return {
      totalDuration,
      totalLectures: lectures.length,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * التحقق من إمكانية إصدار الشهادة
 * @param {ObjectId} userId - معرف المستخدم
 * @param {ObjectId} courseId - معرف الدورة
 * @returns {Object}
 */
exports.canIssueCertificate = async (userId, courseId) => {
  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return {
        canIssue: false,
        reason: 'لم تسجل في هذه الدورة',
      };
    }

    if (enrollment.overallProgress < 100) {
      return {
        canIssue: false,
        reason: 'يجب إكمال الدورة بالكامل أولاً',
        progress: enrollment.overallProgress,
      };
    }

    if (enrollment.certificateIssued) {
      return {
        canIssue: false,
        reason: 'تم إصدار الشهادة مسبقاً',
        issuedAt: enrollment.certificateIssuedAt,
      };
    }

    return {
      canIssue: true,
      enrollment,
    };
  } catch (error) {
    throw error;
  }
};
