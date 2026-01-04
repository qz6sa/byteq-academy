/**
 * API Features Class
 * للبحث والفلترة والترتيب والـ Pagination
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * البحث في العنوان والوصف
   */
  search() {
    if (this.queryString.q) {
      const keyword = this.queryString.q;
      this.query = this.query.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { shortDescription: { $regex: keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  /**
   * الفلترة
   */
  filter() {
    const queryCopy = { ...this.queryString };

    // إزالة الحقول التي لا تستخدم في الفلترة
    const removeFields = ['q', 'sort', 'page', 'limit', 'fields'];
    removeFields.forEach((field) => delete queryCopy[field]);

    // الفلترة المتقدمة (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * الترتيب
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // الترتيب الافتراضي (الأحدث أولاً)
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * تحديد الحقول
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Pagination
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    this.pagination = {
      page,
      limit,
    };

    return this;
  }
}

module.exports = ApiFeatures;
