/**
 * YouTube Helper Functions
 * للتعامل مع روابط اليوتيوب
 */

/**
 * استخراج Video ID من رابط YouTube
 * @param {String} url - رابط اليوتيوب
 * @returns {String|null} - Video ID أو null
 */
exports.extractVideoId = (url) => {
  if (!url) return null;

  const patterns = [
    // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([^&\n?#]+)/,
    // https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    // https://www.youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    // Video ID مباشر (11 حرف)
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * التحقق من صحة رابط YouTube
 * @param {String} url - رابط اليوتيوب
 * @returns {Boolean}
 */
exports.validateYoutubeUrl = (url) => {
  if (!url) return false;
  const videoId = exports.extractVideoId(url);
  return videoId !== null && videoId.length === 11;
};

/**
 * إنشاء رابط Embed من Video ID
 * @param {String} videoId - معرف الفيديو
 * @returns {String}
 */
exports.getEmbedUrl = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * إنشاء رابط Thumbnail من Video ID
 * @param {String} videoId - معرف الفيديو
 * @param {String} quality - جودة الصورة (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {String}
 */
exports.getThumbnailUrl = (videoId, quality = 'hqdefault') => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * إنشاء رابط YouTube كامل من Video ID
 * @param {String} videoId - معرف الفيديو
 * @returns {String}
 */
exports.getWatchUrl = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/watch?v=${videoId}`;
};
