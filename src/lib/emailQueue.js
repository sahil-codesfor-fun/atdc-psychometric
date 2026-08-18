import nodemailer from 'nodemailer';

let transporter = null;
const queue = [];
let isProcessing = false;

function getTransporter() {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 1, // Limit to 1 active connection to prevent SMTP rate limit crashes
      maxMessages: 100,
      rateLimit: 1, // Max 1 email per rateDelta
      rateDelta: 2000, // 2 seconds delay between emails (30 emails/min max)
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }
  return transporter;
}

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  while (queue.length > 0) {
    const item = queue[0];
    const mailTransporter = getTransporter();

    if (!mailTransporter) {
      console.warn('⚠️ [Email Queue] Missing EMAIL_USER or EMAIL_PASS. Skipping email.');
      queue.shift();
      continue;
    }

    try {
      console.log(`📧 [Email Queue] Processing email (${queue.length} in queue) for: ${item.to}`);
      const mailInfo = await mailTransporter.sendMail(item.mailOptions);
      console.log(`✅ [Email Queue] Email sent to ${item.to}. Message ID: ${mailInfo.messageId}`);
      queue.shift();
    } catch (error) {
      item.retries = (item.retries || 0) + 1;
      console.error(`❌ [Email Queue] Error sending to ${item.to} (Attempt ${item.retries}/3):`, error?.message || error);
      
      if (item.retries >= 3) {
        console.error(`❌ [Email Queue] Max retries reached for ${item.to}. Dropping from queue.`);
        queue.shift();
      } else {
        // Wait 5s before retrying failed email
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (queue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  isProcessing = false;
}

export function queueEmail(to, mailOptions) {
  if (!to) {
    console.warn('⚠️ [Email Queue] Skipped: No recipient email provided.');
    return;
  }
  
  queue.push({ to, mailOptions, retries: 0 });
  console.log(`📥 [Email Queue] Queued report email for ${to}. Current queue size: ${queue.length}`);
  
  processQueue().catch((err) => console.error('Error in processQueue:', err));
}
