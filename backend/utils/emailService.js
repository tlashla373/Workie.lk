const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter with enhanced configuration
const createTransporter = () => {
  // Remove spaces from app password if any
  const cleanPassword = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
  
  // Log configuration (without sensitive data)
  logger.info('Creating email transporter', {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER ? '***configured***' : 'missing',
    passwordConfigured: !!cleanPassword,
    passwordLength: cleanPassword ? cleanPassword.length : 0
  });

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    // Enable TLS automatically when using port 465
    secure: (parseInt(process.env.EMAIL_PORT) || 587) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPassword
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
    logger: process.env.NODE_ENV === 'development' // Enable logging in development
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
          logger.error('Transporter verification error', {
            error: error.message,
            stack: error.stack,
            emailConfig: {
              host: 'smtp.gmail.com',
              port: 587,
              user: process.env.EMAIL_USER ? '***configured***' : 'missing'
            }
          });
          reject(error);
        } else {
          logger.info('Email server ready to send messages');
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: `"Workie.lk" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', {
      messageId: result.messageId,
      to: options.to,
      subject: options.subject,
      response: result.response
    });
    return result;
  } catch (error) {
    logger.error('Email sending failed', {
      error: error.message,
      stack: error.stack,
      to: options.to,
      subject: options.subject,
      code: error.code,
      command: error.command
    });
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
  }),

  // Password reset PIN verification
  passwordResetPin: (firstName, pin) => ({
    subject: 'Password Reset PIN - Workie.lk',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>You requested to reset your password for your Workie.lk account. Please use the PIN below to verify your identity:</p>
        <div style="font-size: 2.5em; font-weight: bold; letter-spacing: 10px; margin: 30px 0; color: #dc2626; text-align: center; background-color: #fef2f2; padding: 20px; border-radius: 8px; border: 2px dashed #dc2626;">
          ${pin}
        </div>
        <p><strong>This PIN will expire in 10 minutes.</strong></p>
        <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
        <br>
        <p>Best regards,<br>The Workie.lk Team</p>
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

// Send password reset PIN
const sendPasswordResetPin = async (email, firstName, pin) => {
  const template = emailTemplates.passwordResetPin(firstName, pin);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

// Send OTP Email
const sendOtpEmail = async (email, otp, firstName) => {
  const template = {
    subject: 'Verify Your Email - Workie.lk',
    text: `Hi ${firstName},\n\nYour email verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nWorkie.lk Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">Workie.lk</h1>
          <h2 style="color: #6c67f0; margin: 0;">Welcome Our Community</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h3 style="color: #333; margin-bottom: 20px;">Email Verification</h3>
          <p style="color: #666; margin-bottom: 30px;">Hi ${firstName},</p>
          <p style="color: #666; margin-bottom: 30px;">Please use the following verification code to verify your email address:</p>
          
          <div style="background-color: #3B82F6; color: white; padding: 15px 30px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 30px 0;">
            ${otp}
          </div>
          
          <p style="color: #666; margin-bottom: 20px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            This email was sent by Workie.lk<br>
            © 2025 Workie.lk. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  await sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    
    // Test the connection
    const isConnected = await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          logger.error('Email connection test failed', {
            error: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack
          });
          reject(error);
        } else {
          logger.info('Email connection test successful');
          resolve(success);
        }
      });
    });

    return { success: true, message: 'Email connection successful' };
  } catch (error) {
    logger.error('Email connection test error', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return { success: false, error: error.message };
  }
};

// Send test email
const sendTestEmail = async (toEmail = process.env.EMAIL_USER) => {
  try {
    const result = await sendEmail({
      to: toEmail,
      subject: 'Test Email - Workie.lk',
      text: 'This is a test email to verify email sending functionality.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3B82F6;">Test Email - Workie.lk</h2>
          <p>This is a test email to verify email sending functionality.</p>
          <p>If you receive this email, the email service is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendJobApplicationEmail,
  sendApplicationAcceptedEmail,
  sendJobCompletedEmail,
  sendReviewReceivedEmail,
  sendEmailVerificationCode,
  sendPasswordResetPin,
  sendOtpEmail,
  testEmailConnection,
  sendTestEmail
};