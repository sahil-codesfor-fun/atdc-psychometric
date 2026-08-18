import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    console.warn('⚠️ [Email Warning] EMAIL_USER or EMAIL_PASS is missing in environment variables.');
    return null;
  }

  if (!transporter) {
    const host = process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com';
    const port = Number(process.env.EMAIL_PORT) || 465;
    const secure = process.env.EMAIL_SECURE !== undefined ? process.env.EMAIL_SECURE === 'true' : port === 465;

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }
  return transporter;
}

export async function sendEmail(to, mailOptions) {
  if (!to) {
    console.warn('⚠️ [Email Warning] No recipient email address provided.');
    return { success: false, error: 'No recipient email' };
  }

  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    console.warn(`⚠️ [Email Warning] Email server not configured. Skipped sending report to ${to}.`);
    return { success: false, error: 'Email credentials missing' };
  }

  try {
    console.log(`📧 [Email] Sending assessment report to: ${to}...`);
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`✅ [Email] Report successfully sent to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Email Error] Failed to send email to ${to}:`, error?.message || error);
    return { success: false, error: error?.message || error };
  }
}

export function queueEmail(to, mailOptions) {
  sendEmail(to, mailOptions).catch((err) => {
    console.error(`❌ [Email Queue Error] Async send failed for ${to}:`, err?.message || err);
  });
}
