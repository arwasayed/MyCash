const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    if (!options.email || !options.subject || !options.message) {
      throw new Error('Missing required email options');
    }
    console.log('Attempting to send email to:', options.email);
    console.log('Email subject:', options.subject);
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
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `<p>${options.message}</p>` 
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; 
  }
};

module.exports = sendEmail;