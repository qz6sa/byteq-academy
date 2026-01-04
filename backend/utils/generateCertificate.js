const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { uploadImage } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

/**
 * إنشاء شهادة PDF
 * @param {Object} data - بيانات الشهادة
 * @returns {Buffer} - PDF Buffer
 */
exports.generateCertificatePDF = async (data) => {
  const {
    studentName,
    courseName,
    completionDate,
    certificateId,
    verificationUrl,
  } = data;

  return new Promise(async (resolve, reject) => {
    try {
      // إنشاء PDF Document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50,
      });

      const chunks = [];

      // جمع البيانات
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ================================
      // تصميم الشهادة
      // ================================

      // الخلفية
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

      // الإطار الخارجي
      doc
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(3)
        .stroke('#2c3e50');

      // الإطار الداخلي
      doc
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .lineWidth(1)
        .stroke('#34495e');

      // العنوان الرئيسي
      doc
        .fontSize(40)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Certificate of Completion', 60, 100, {
          align: 'center',
          width: doc.page.width - 120,
        });

      doc
        .fontSize(28)
        .font('Helvetica-Bold')
        .fillColor('#3498db')
        .text('شهادة إتمام', 60, 150, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // النص التوضيحي
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor('#34495e')
        .text('This certifies that', 60, 210, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // اسم الطالب
      doc
        .fontSize(32)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text(studentName, 60, 240, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // خط تحت الاسم
      doc
        .moveTo(200, 285)
        .lineTo(doc.page.width - 200, 285)
        .lineWidth(2)
        .stroke('#3498db');

      // نص إكمال الدورة
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor('#34495e')
        .text('has successfully completed the course', 60, 310, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // اسم الدورة
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#3498db')
        .text(courseName, 60, 340, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // التاريخ
      const formattedDate = new Date(completionDate).toLocaleDateString(
        'ar-EG',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );

      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#34495e')
        .text(`Completion Date: ${formattedDate}`, 60, 400, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // معرف الشهادة
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#7f8c8d')
        .text(`Certificate ID: ${certificateId}`, 60, 430, {
          align: 'center',
          width: doc.page.width - 120,
        });

      // إنشاء QR Code
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
          width: 120,
          margin: 1,
        });

        // تحويل Data URL إلى Buffer
        const qrBuffer = Buffer.from(
          qrCodeDataUrl.split(',')[1],
          'base64'
        );

        // إضافة QR Code
        doc.image(qrBuffer, doc.page.width - 170, doc.page.height - 170, {
          width: 100,
          height: 100,
        });

        doc
          .fontSize(8)
          .fillColor('#7f8c8d')
          .text('Scan to verify', doc.page.width - 170, doc.page.height - 60, {
            width: 100,
            align: 'center',
          });
      } catch (qrError) {
        console.log('خطأ في إنشاء QR Code:', qrError);
      }

      // التوقيع والختم (نص فقط)
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('ByTeq Academy', 100, doc.page.height - 120, {
          width: 200,
          align: 'center',
        });

      doc
        .moveTo(120, doc.page.height - 95)
        .lineTo(280, doc.page.height - 95)
        .lineWidth(1)
        .stroke('#34495e');

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#7f8c8d')
        .text('Authorized Signature', 100, doc.page.height - 85, {
          width: 200,
          align: 'center',
        });

      // رابط التحقق
      doc
        .fontSize(9)
        .fillColor('#3498db')
        .text(
          `Verify at: ${verificationUrl}`,
          60,
          doc.page.height - 40,
          {
            align: 'center',
            width: doc.page.width - 240,
            link: verificationUrl,
          }
        );

      // إنهاء PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * رفع شهادة PDF إلى Cloudinary
 * @param {Buffer} pdfBuffer - PDF Buffer
 * @param {String} certificateId - معرف الشهادة
 * @returns {Object} - URL والـ public_id
 */
exports.uploadCertificateToCloudinary = async (pdfBuffer, certificateId) => {
  try {
    // تحويل Buffer إلى Base64 Data URI
    const base64Pdf = pdfBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Pdf}`;

    // رفع إلى Cloudinary
    const result = await uploadImage(
      dataUri,
      `certificates/${certificateId}`,
      0,
      0
    );

    return result;
  } catch (error) {
    throw new Error(`فشل رفع الشهادة: ${error.message}`);
  }
};

/**
 * إنشاء QR Code
 * @param {String} url - الرابط
 * @returns {String} - QR Code Data URL
 */
exports.generateQRCode = async (url) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2c3e50',
        light: '#ffffff',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`فشل إنشاء QR Code: ${error.message}`);
  }
};
