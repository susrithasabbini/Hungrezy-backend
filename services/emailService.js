import nodemailer from 'nodemailer';
import { NOTIFICATION_EMAIL,NOTIFICATION_PASSWORD } from '../config/index.js';
import fs from 'fs';

const createTransport = async(SENDER_EMAIL_ID,SENDER_EMAIL_PASSWORD) => {
  try {
     const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: SENDER_EMAIL_ID,
              pass: SENDER_EMAIL_PASSWORD,
          },
      });
      return transport;
  } catch (error) {
      console.error('Error occurred in createTransport()');
      console.error(error);
      throw error;
  }
}


const sendVerificationEmail = async(email, verificationCode) => {
  const htmlContent = fs.readFileSync('public/EmailVerificationTemplate.html', 'utf-8');
  const notificationTransporter = await createTransport(NOTIFICATION_EMAIL,NOTIFICATION_PASSWORD);
  const emailContent = htmlContent.replace('{verificationCode}', verificationCode);
  const mailOptions = {
    from: NOTIFICATION_EMAIL,
    to: email,
    subject: 'Hungrezy Verification Code',
    html: emailContent,
  };
  notificationTransporter.sendMail(mailOptions, (error, info) => {
    if (error)console.error(error);
    else console.log('Email sent: ' + info.response);
  });
};

const shareAdminCredentialsEmail = async(email, password,name) => {
  const htmlContent = fs.readFileSync('public/AdminCredentials.html', 'utf-8');
  const notificationTransporter = await createTransport(NOTIFICATION_EMAIL,NOTIFICATION_PASSWORD);
  const emailContent = htmlContent.replace('{email}', email).replace('{password}', password).replace('{Admin}',name)
  const mailOptions = {
    from: NOTIFICATION_EMAIL,
    to: email,
    subject: 'Hungrezy Admin Credentials',
    html: emailContent,
  };
  notificationTransporter.sendMail(mailOptions, (error, info) => {
    if (error)console.error(error);
    else console.log('Email sent: ' + info.response);
  });
};


export {
  sendVerificationEmail,
  shareAdminCredentialsEmail,
}