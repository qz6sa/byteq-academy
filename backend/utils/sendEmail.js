const nodemailer = require('nodemailer');

/**
 * Send Email Function
 * يرسل بريد إلكتروني باستخدام Nodemailer
 */
const sendEmail = async (options) => {
  // إنشاء transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // خيارات البريد
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message.replace(/\n/g, '<br>'),
  };

  // إرسال البريد
  const info = await transporter.sendMail(mailOptions);

  console.log('تم إرسال البريد:', info.messageId);
};

module.exports = sendEmail;
