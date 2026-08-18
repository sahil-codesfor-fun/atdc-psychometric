import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ensureSchema } from '@/lib/schema';
import { generateAssessmentEmailHtml } from '@/lib/emailTemplate';
import { sendEmail } from '@/lib/emailQueue';

export async function POST(request) {
  try {
    const submission = await request.json();
    await ensureSchema();

    const resultJson = typeof submission.result === 'string' ? submission.result : JSON.stringify(submission.result ?? {});
    const responsesJson = JSON.stringify(submission.responses ?? []);

    const sql = `
      INSERT INTO submissions
      (name, dob, course, married, education, religion, gender, email, phone, occupation, institution, city, state, rural_or_urban, test_name, score, result, responses, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      submission.name || null,
      submission.dob || null,
      submission.course || null,
      submission.married ? 1 : 0,
      submission.education || '',
      submission.religion || 'not-specified',
      submission.gender || null,
      submission.email || null,
      submission.phone || null,
      submission.occupation || '',
      submission.institution || null,
      submission.city || null,
      submission.state || null,
      submission.rural_or_urban || 'not-specified',
      submission.test_name || null,
      Number(submission.score || 0),
      resultJson,
      responsesJson,
    ];

    const [insertResult] = await db.execute(sql, values);
    const submissionId = insertResult.insertId;

    const responses = submission.responses;
    const rows = [];
    if (Array.isArray(responses)) {
      if (submission.test_key === 'belbin') {
        responses.forEach((section, sectionIndex) => {
          (section || []).forEach((value, itemIndex) => {
            rows.push([submissionId, itemIndex + 1, String.fromCharCode(65 + sectionIndex), `Belbin Section ${String.fromCharCode(65 + sectionIndex)} - Statement ${itemIndex + 1}`, String(value ?? 0), Number(value ?? 0)]);
          });
        });
      } else {
        responses.forEach((value, index) => {
          rows.push([submissionId, index + 1, null, null, typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''), Number(value) || null]);
        });
      }
    }
    if (rows.length) {
      await db.query(
        `INSERT INTO submission_responses (submission_id, question_number, section_label, question_text, selected_value, score_value) VALUES ?`,
        [rows]
      );
    }

    if (submission.email) {
      const emailUser = process.env.EMAIL_USER?.trim();
      const htmlTemplate = generateAssessmentEmailHtml(submission);
      const mailOptions = {
        from: `"ATDC Assessment Portal" <${emailUser || 'noreply@atdc.com'}>`,
        to: submission.email,
        subject: `Your ${submission.test_name || 'Assessment'} Official Report - ATDC Assessment Portal`,
        html: htmlTemplate,
      };

      try {
        await sendEmail(submission.email, mailOptions);
      } catch (mailErr) {
        console.error('❌ Failed to send assessment email:', mailErr?.message || mailErr);
      }
    }

    return NextResponse.json({ success: true, submissionId }, { status: 201 });
  } catch (error) {
    console.error('Error in submit-details:', error);
    return NextResponse.json({ error: 'Failed to submit details', details: error.message }, { status: 500 });
  }
}
