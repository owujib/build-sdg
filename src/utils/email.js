import nodemailer from 'nodemailer';
require('dotenv').config();

//using nodemailer
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    auth: {
      user: 'project.2',
      pass: 'secret.2'
    }
  });

  const mailOptions = {
    from: 'farmhub 🌿🌿 <noreply@farmhub.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
