
const nodemailer = require('nodemailer');

// Create a test account for development purposes 
// In production, use real SMTP credentials
let transporter;

async function setupTransporter() {
  if (transporter) return transporter;
  
  // For development/testing
  const testAccount = await nodemailer.createTestAccount();
  
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || testAccount.user,
      pass: process.env.SMTP_PASS || testAccount.pass,
    },
  });
  
  return transporter;
}

async function sendOTP(email, otp) {
  const transport = await setupTransporter();
  
  const info = await transport.sendMail({
    from: '"FestX Support" <noreply@festx.com>',
    to: email,
    subject: "Your FestX Login OTP",
    text: `Your OTP for logging into FestX is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">FestX Authentication</h2>
        <p>Hello,</p>
        <p>Your one-time password (OTP) for logging into FestX is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p>Best regards,<br>FestX Team</p>
      </div>
    `,
  });
  
  console.log("Email sent: %s", info.messageId);
  
  // For development, log preview URL (only works with Ethereal)
  if (process.env.NODE_ENV !== 'production') {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

module.exports = {
  sendOTP
};
