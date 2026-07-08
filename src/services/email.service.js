import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLoginNotification = async (toEmail, device, ipAddress) => {
    const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'New Login Detected',
    html: `
      <h1>New Login Alert</h1>
      <p>We detected a new login to your account.</p>
      <ul>
        <li><strong>Device:</strong> ${device}</li>
        <li><strong>IP Address:</strong> ${ipAddress}</li>
      </ul>
    `
  };
  try{
    await transporter.sendMail(mailOptions);
    console.log(`Security email sent to ${toEmail}`);
  }catch (error) {
    console.error('Error sending email:', error);
  }
};