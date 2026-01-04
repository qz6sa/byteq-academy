const cloudinary = require('cloudinary').v2;

/**
 * إعداد Cloudinary
 * يستخدم لرفع الصور فقط (thumbnails, avatars, category images)
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * رفع صورة إلى Cloudinary
 * @param {Buffer|String} file - الملف أو path
 * @param {String} folder - المجلد في Cloudinary
 * @param {Number} width - العرض (optional)
 * @param {Number} height - الارتفاع (optional)
 */
const uploadImage = async (file, folder, width = 800, height = 600) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `byteq-academy/${folder}`,
      transformation: [
        {
          width,
          height,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`فشل رفع الصورة: ${error.message}`);
  }
};

/**
 * حذف صورة من Cloudinary
 * @param {String} publicId - معرف الصورة
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`فشل حذف الصورة: ${error.message}`);
  }
};

module.exports = { cloudinary, uploadImage, deleteImage };
