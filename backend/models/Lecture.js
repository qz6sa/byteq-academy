const mongoose = require('mongoose');

/**
 * Lecture Schema
 * نموذج الدروس (فيديوهات YouTube)
 */
const lectureSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'معرف القسم مطلوب'],
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'معرف الدورة مطلوب'],
    },

    title: {
      type: String,
      required: [true, 'عنوان الدرس مطلوب'],
      trim: true,
    },

    description: {
      type: String,
    },

    youtubeVideoId: {
      type: String,
    },

    youtubeUrl: {
      type: String,
      required: [true, 'رابط اليوتيوب مطلوب'],
    },

    duration: {
      type: Number,
      required: [true, 'مدة الفيديو مطلوبة'],
      min: 0,
    },

    order: {
      type: Number,
      required: [true, 'ترتيب الدرس مطلوب'],
    },

    resources: [
      {
        name: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
      },
    ],

    isFree: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// استخراج Video ID من YouTube URL
lectureSchema.pre('save', function (next) {
  if (this.isModified('youtubeUrl') && this.youtubeUrl) {
    const videoId = extractYoutubeId(this.youtubeUrl);
    if (videoId) {
      this.youtubeVideoId = videoId;
    }
  }
  next();
});

// Helper function لاستخراج YouTube Video ID
function extractYoutubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

module.exports = mongoose.model('Lecture', lectureSchema);
