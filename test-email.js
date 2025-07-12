require('dotenv').config();
const nodemailer = require('nodemailer');

const sendTestEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: 'hagarhussien238@gmail.com', // بريدك الخاص
      subject: 'Test Email',
      text: 'This is a test email from MyCash to check email settings.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('Error sending test email:', err.message);
  }
};

sendTestEmail();