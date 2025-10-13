const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfiguration() {
  console.log('Testing email configuration...');
  
  // Clean the password (remove spaces)
  const cleanPassword = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
  
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Password length:', cleanPassword.length);
  console.log('Password format (first 4 chars):', cleanPassword.substring(0, 4) + '...');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'Test Email - Workie.lk',
      text: 'This is a test email to verify the email configuration.',
      html: '<p>This is a test email to verify the email configuration.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email configuration error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Make sure 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Generate a new App Password:');
      console.log('   - Go to https://myaccount.google.com/security');
      console.log('   - Click on "2-Step Verification"');
      console.log('   - Scroll down to "App passwords"');
      console.log('   - Generate a new password for "Mail"');
      console.log('3. Update the EMAIL_PASS in your .env file with the new app password (no spaces)');
      console.log('4. Make sure "Less secure app access" is OFF (use App Passwords instead)');
    }
  }
}

testEmailConfiguration();