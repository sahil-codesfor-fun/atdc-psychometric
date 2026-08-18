require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

async function diagnose() {
  console.log('=== 1. CHECKING ENVIRONMENT VARIABLES ===');
  console.log('DATABASE_URL present?:', Boolean(process.env.DATABASE_URL));
  if (process.env.DATABASE_URL) {
    const masked = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
    console.log('DATABASE_URL:', masked);
  }
  console.log('EMAIL_USER present?:', Boolean(process.env.EMAIL_USER), process.env.EMAIL_USER || '');
  console.log('EMAIL_PASS present?:', Boolean(process.env.EMAIL_PASS), process.env.EMAIL_PASS ? `(Length: ${process.env.EMAIL_PASS.length} chars)` : '');

  console.log('\n=== 2. CHECKING DATABASE CONNECTION & LATEST SUBMISSIONS ===');
  if (process.env.DATABASE_URL) {
    try {
      const pool = mysql.createPool(process.env.DATABASE_URL);
      const [rows] = await pool.query('SELECT id, name, email, test_name, score, timestamp FROM submissions ORDER BY id DESC LIMIT 5');
      console.log(`Found ${rows.length} recent submissions:`);
      console.table(rows);
    } catch (err) {
      console.error('Database connection / query failed:', err.message);
    }
  } else {
    console.log('Skipping DB query: DATABASE_URL is not set.');
  }

  console.log('\n=== 3. CHECKING SMTP NODEMAILER CONNECTION ===');
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_USER or EMAIL_PASS is missing in environment variables (.env or .env.local).');
  } else {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim()
      }
    });

    try {
      console.log('Verifying SMTP transporter with Gmail...');
      await transporter.verify();
      console.log('✅ SMTP transporter verified successfully! Credentials are valid.');
    } catch (smtpErr) {
      console.error('❌ SMTP verification failed with error:');
      console.error(smtpErr);
    }
  }
}

diagnose().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
