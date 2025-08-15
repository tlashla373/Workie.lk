const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter connection
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log('Transporter verification error:', error);
          reject(error);
        } else {
          console.log('Server is ready to take our messages');
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: `"Workie.lk" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Detailed email error:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Welcome email
  welcome: (firstName, userType) => ({
    subject: 'Welcome to Workie.lk!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Workie.lk, ${firstName}!</h2>
        <p>Thank you for joining our platform as a ${userType}.</p>
        <p>You can now ${userType === 'worker' ? 'browse and apply for jobs' : 'post jobs and find skilled workers'}.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Get Started
          </a>
        </div>
        <p>Best regards,<br>The Workie.lk Team</p>
      </div>
    `
  }),

  // Password reset email
  passwordReset: (firstName, resetToken) => ({
    subject: 'Password Reset Request - Workie.lk',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>You requested a password reset for your Workie.lk account.</p>
        <p>Click the button below to reset your password (valid for 10 minutes):</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Workie.lk Team</p>
      </div>
    `
  }),

  // Job application notification
  jobApplication: (clientName, workerName, jobTitle) => ({
    subject: `New Application for "${jobTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Job Application</h2>
        <p>Hi ${clientName},</p>
        <p><strong>${workerName}</strong> has applied for your job:</p>
        <p style="font-size: 18px; font-weight: bold; color: #1f2937;">"${jobTitle}"</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/jobs" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Application
          </a>
        </div>
        <p>Best regards,<br>The Workie.lk Team</p>
      </div>
    `
  }),

  // Application accepted notification
  applicationAccepted: (workerName, jobTitle, clientName) => ({
    subject: `Application Accepted - "${jobTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Congratulations!</h2>
        <p>Hi ${workerName},</p>
        <p>Great news! Your application has been accepted for:</p>
        <p style="font-size: 18px; font-weight: bold; color: #1f2937;">"${jobTitle}"</p>
        <p>Client: <strong>${clientName}</strong></p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/jobs" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Job Details
          </a>
        </div>
        <p>Best regards,<br>The Workie.lk Team</p>
      </div>
    `
  }),

  // Job completion notification
  jobCompleted: (recipientName, jobTitle, isClient) => ({
    subject: `Job Completed - "${jobTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Job Completed!</h2>
        <p>Hi ${recipientName},</p>
        <p>The job "${jobTitle}" has been marked as completed.</p>
        <p>${isClient ? 'Please review the work and provide feedback for the worker.' : 'Thank you for completing the job! Please ask your client to leave a review.'}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/jobs" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            ${isClient ? 'Leave Review' : 'View Job'}
          </a>
        </div>
        <p>Best regards,<br>The Workie.lk Team</p>
      </div>
    `
  }),

  // Review received notification
  reviewReceived: (recipientName, reviewerName, rating, jobTitle) => ({
    subject: `New Review Received - ${rating} Stars`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Review Received!</h2>
        <p>Hi ${recipientName},</p>
        <p><strong>${reviewerName}</strong> left you a review for the job "${jobTitle}".</p>
        <p style="font-size: 20px;">Rating: ${'⭐'.repeat(rating)} (${rating}/5)</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/profile" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Review
          </a>
        </div>
        <p>Best regards,<br>The Workie.lk Team</p>
      </div>
    `
  }),

  // Email verification with 5-digit code
  emailVerificationCode: (firstName, code) => ({
    subject: 'Verify Your Email - Workie.lk',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome to Workie.lk, ${firstName}!</h2>
        <p>Thank you for registering. Please verify your email address using the code below:</p>
        <div style="font-size: 2em; font-weight: bold; letter-spacing: 8px; margin: 20px 0; color: #1976d2;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not create this account, please ignore this email.</p>
        <br>
        <p>Best regards,<br>Workie.lk Team</p>
      </div>
    `
  })
};

// Wrapper functions for specific email types
const sendWelcomeEmail = async (email, firstName, userType) => {
  const template = emailTemplates.welcome(firstName, userType);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  const template = emailTemplates.passwordReset(firstName, resetToken);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

const sendJobApplicationEmail = async (clientEmail, clientName, workerName, jobTitle) => {
  const template = emailTemplates.jobApplication(clientName, workerName, jobTitle);
  return await sendEmail({
    to: clientEmail,
    subject: template.subject,
    html: template.html
  });
};

const sendApplicationAcceptedEmail = async (workerEmail, workerName, jobTitle, clientName) => {
  const template = emailTemplates.applicationAccepted(workerName, jobTitle, clientName);
  return await sendEmail({
    to: workerEmail,
    subject: template.subject,
    html: template.html
  });
};

const sendJobCompletedEmail = async (email, recipientName, jobTitle, isClient) => {
  const template = emailTemplates.jobCompleted(recipientName, jobTitle, isClient);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

const sendReviewReceivedEmail = async (email, recipientName, reviewerName, rating, jobTitle) => {
  const template = emailTemplates.reviewReceived(recipientName, reviewerName, rating, jobTitle);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

// Send email verification with 5-digit code
const sendEmailVerificationCode = async (email, firstName, code) => {
  const template = emailTemplates.emailVerificationCode(firstName, code);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendJobApplicationEmail,
  sendApplicationAcceptedEmail,
  sendJobCompletedEmail,
  sendReviewReceivedEmail,
  sendEmailVerificationCode
};