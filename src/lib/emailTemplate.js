function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function renderSuggestions(suggestions) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return '';
  const items = suggestions
    .map((s) => `<li style="margin-bottom: 6px; color: #334155; line-height: 1.5;">${escapeHtml(s)}</li>`)
    .join('');

  return `
    <div style="margin-top: 24px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px 20px;">
      <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        💡 Recommendations &amp; Action Plan
      </h4>
      <ul style="margin: 0; padding-left: 20px;">
        ${items}
      </ul>
    </div>
  `;
}

function renderInfoBox(title, content) {
  if (!content) return '';
  return `
    <div style="margin-top: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f2c59; border-radius: 6px; padding: 14px 18px;">
      <h4 style="margin: 0 0 6px 0; color: #0f2c59; font-size: 14px; font-weight: 700;">${escapeHtml(title)}</h4>
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">${escapeHtml(content)}</p>
    </div>
  `;
}

function renderBelbinResult(result) {
  const primaryName = result.primaryRole?.name || 'Primary Role';
  const primaryScore = result.primaryRole?.score ?? 0;
  const secondaryName = result.secondaryRole?.name || 'Secondary Role';
  const secondaryScore = result.secondaryRole?.score ?? 0;

  const roleDetails = result.roleDetails || result.breakdown || [];
  const rolesHtml = roleDetails.map((role, index) => {
    const isPrimary = index === 0;
    const isSecondary = index === 1;
    const badge = isPrimary
      ? '<span style="display:inline-block; margin-left:8px; background-color:#0f2c59; color:#ffffff; font-size:11px; font-weight:600; padding:2px 8px; border-radius:12px;">Primary</span>'
      : isSecondary
        ? '<span style="display:inline-block; margin-left:8px; background-color:#e2e8f0; color:#334155; font-size:11px; font-weight:600; padding:2px 8px; border-radius:12px;">Secondary</span>'
        : '';

    const borderStyle = (isPrimary || isSecondary) ? 'border: 1px solid rgba(15, 44, 89, 0.4);' : 'border: 1px solid #e2e8f0;';
    const bgStyle = isPrimary ? 'background-color: #eff6ff;' : 'background-color: #ffffff;';

    return `
      <div style="margin-bottom: 12px; border-radius: 8px; padding: 14px 16px; ${borderStyle} ${bgStyle}">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 8px;">
          <div>
            <strong style="color: #0f2c59; font-size: 15px;">${index + 1}. ${escapeHtml(role.name)}</strong>
            ${badge}
          </div>
          <div style="font-size: 16px; font-weight: 700; color: #0f172a;">${escapeHtml(role.score)} pts</div>
        </div>
        <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #475569;">
          ${role.function ? `<tr><td width="90" style="vertical-align:top; font-weight:600; color:#1e293b;">Function:</td><td>${escapeHtml(role.function)}</td></tr>` : ''}
          ${role.strength ? `<tr><td width="90" style="vertical-align:top; font-weight:600; color:#1e293b;">Strength:</td><td>${escapeHtml(role.strength)}</td></tr>` : ''}
          ${role.weakness ? `<tr><td width="90" style="vertical-align:top; font-weight:600; color:#1e293b;">Watch-out:</td><td>${escapeHtml(role.weakness)}</td></tr>` : ''}
        </table>
      </div>
    `;
  }).join('');

  return `
    <!-- Top 2 Roles -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td width="48%" style="vertical-align: top;">
          <div style="background-color: #eff6ff; border: 1px solid rgba(15, 44, 89, 0.2); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px;">Primary Role</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f2c59; margin-bottom: 4px;">${escapeHtml(primaryName)}</div>
            <div style="font-size: 26px; font-weight: 900; color: #1e40af;">${escapeHtml(primaryScore)}</div>
          </div>
        </td>
        <td width="4%"></td>
        <td width="48%" style="vertical-align: top;">
          <div style="background-color: #f8fafc; border: 1px solid rgba(15, 44, 89, 0.2); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px;">Secondary Role</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f2c59; margin-bottom: 4px;">${escapeHtml(secondaryName)}</div>
            <div style="font-size: 26px; font-weight: 900; color: #0284c7;">${escapeHtml(secondaryScore)}</div>
          </div>
        </td>
      </tr>
    </table>

    ${result.description ? `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 16px 0;">${escapeHtml(result.description)}</p>` : ''}

    <!-- Complete Role Profile -->
    <div style="margin-top: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
      <h3 style="margin: 0 0 14px 0; color: #0f2c59; font-size: 15px; font-weight: 700;">Complete Team Role Profile</h3>
      ${rolesHtml}
    </div>

    ${renderSuggestions(result.suggestions)}
  `;
}

function renderMcClellandResult(result) {
  const dominantName = result.dominantNeed?.name || 'Dominant Need';
  const dominantScore = result.dominantNeed?.score ?? 0;
  const secondaryName = result.secondaryNeed?.name || '';
  const secondaryScore = result.secondaryNeed?.score ?? 0;

  const motivationDetails = result.motivationDetails || [];
  const detailsHtml = motivationDetails.map((item) => {
    const percentage = item.percentage ?? Math.round(((item.score || 0) / 40) * 100);
    return `
      <div style="margin-bottom: 14px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="color: #0f2c59; font-size: 15px;">${escapeHtml(item.name)} Motivation</strong>
          <span style="font-weight: 700; color: #0f172a; font-size: 14px;">${escapeHtml(item.score)} / 40 (${percentage}%)</span>
        </div>
        <div style="background-color: #f1f5f9; border-radius: 6px; height: 10px; overflow: hidden; margin-bottom: 10px;">
          <div style="background-color: #1e40af; height: 10px; width: ${Math.min(100, Math.max(0, percentage))}%; border-radius: 6px;"></div>
        </div>
        ${item.description ? `<p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">${escapeHtml(item.description)}</p>` : ''}
      </div>
    `;
  }).join('');

  return `
    <!-- Top summary card -->
    <div style="margin: 20px 0; background-color: #eff6ff; border: 1px solid rgba(15, 44, 89, 0.2); border-radius: 8px; padding: 20px; text-align: center;">
      <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px;">Dominant Motivational Driver</div>
      <div style="font-size: 26px; font-weight: 900; color: #0f2c59;">${escapeHtml(dominantName)} (${escapeHtml(dominantScore)}/40)</div>
      ${secondaryName ? `<div style="font-size: 13px; color: #475569; margin-top: 6px;">Secondary Driver: <strong>${escapeHtml(secondaryName)}</strong> (${escapeHtml(secondaryScore)}/40)</div>` : ''}
    </div>

    ${result.description ? `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 16px 0;">${escapeHtml(result.description)}</p>` : ''}

    <div style="margin-top: 20px;">
      <h3 style="margin: 0 0 12px 0; color: #0f2c59; font-size: 15px; font-weight: 700;">Motivation Breakdown</h3>
      ${detailsHtml}
    </div>

    ${renderSuggestions(result.suggestions)}
  `;
}

function renderMBTIResult(result) {
  const typeCode = result.type || '';
  const typeName = result.typeName || '';

  const dimensionScores = result.dimensionScores || [];
  const dimensionsHtml = dimensionScores.map((d) => {
    const isLeftPreferred = d.preference === d.left;
    const isRightPreferred = d.preference === d.right;

    const leftBoxStyle = isLeftPreferred
      ? 'background-color: #0f2c59; color: #ffffff;'
      : 'background-color: #ffffff; color: #334155; border: 1px solid #e2e8f0;';
    const rightBoxStyle = isRightPreferred
      ? 'background-color: #0f2c59; color: #ffffff;'
      : 'background-color: #ffffff; color: #334155; border: 1px solid #e2e8f0;';

    return `
      <div style="margin-bottom: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: #0f2c59; font-size: 14px;">Dimension: ${escapeHtml(d.dimension)}</strong>
          <span style="font-size: 13px; font-weight: 600; color: #0f172a;">Preference: <strong>${escapeHtml(d.preference)}</strong></span>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="48%" style="text-align: center; border-radius: 6px; padding: 8px; ${leftBoxStyle}">
              <div style="font-weight: 700; font-size: 15px;">${escapeHtml(d.left)}</div>
              <div style="font-size: 12px; margin-top: 2px;">Score: ${escapeHtml(d.leftScore)}</div>
            </td>
            <td width="4%"></td>
            <td width="48%" style="text-align: center; border-radius: 6px; padding: 8px; ${rightBoxStyle}">
              <div style="font-weight: 700; font-size: 15px;">${escapeHtml(d.right)}</div>
              <div style="font-size: 12px; margin-top: 2px;">Score: ${escapeHtml(d.rightScore)}</div>
            </td>
          </tr>
        </table>
      </div>
    `;
  }).join('');

  return `
    <!-- Hero Profile Box -->
    <div style="margin: 20px 0; background-color: #eff6ff; border: 1px solid rgba(15, 44, 89, 0.2); border-radius: 8px; padding: 24px; text-align: center;">
      <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">4-Letter Personality Profile</div>
      <div style="font-size: 40px; font-weight: 900; letter-spacing: 4px; color: #0f2c59; margin-bottom: 4px;">${escapeHtml(typeCode)}</div>
      ${typeName ? `<div style="font-size: 17px; font-weight: 700; color: #1e40af;">${escapeHtml(typeName)}</div>` : ''}
    </div>

    ${result.description ? `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 16px 0; text-align: center;">${escapeHtml(result.description)}</p>` : ''}

    <!-- Dimension Scores -->
    <div style="margin-top: 20px;">
      <h3 style="margin: 0 0 12px 0; color: #0f2c59; font-size: 15px; font-weight: 700;">Cognitive Preference Breakdown</h3>
      ${dimensionsHtml}
    </div>

    ${renderSuggestions(result.suggestions)}
  `;
}

function renderBreakdownResult(result, score) {
  const breakdown = result.breakdown || [];
  const rowsHtml = breakdown.map((cat, index) => {
    return `
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px 14px; font-weight: 600; color: #0f2c59;">${index + 1}. ${escapeHtml(cat.name)}</td>
        <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #0f172a;">${escapeHtml(cat.score)} pts</td>
      </tr>
    `;
  }).join('');

  return `
    ${result.title ? `<div style="font-size: 20px; font-weight: 700; color: #0f2c59; margin: 16px 0 8px 0; text-align:center;">${escapeHtml(result.title)}</div>` : ''}
    ${score !== undefined && score !== null && !isNaN(score) ? `<div style="text-align: center; margin-bottom: 16px;"><span style="font-size: 36px; font-weight: 900; color: #0f2c59;">${escapeHtml(score)}</span> <span style="font-size: 14px; color: #64748b;">Total Score</span></div>` : ''}

    <div style="margin: 16px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="padding: 12px 14px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f2c59; font-size: 14px;">
        Assessment Scores Breakdown
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    ${result.description ? `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 16px 0;">${escapeHtml(result.description)}</p>` : ''}
    ${renderInfoBox('Candidate Profile', result.studentProfile)}
    ${renderInfoBox('Development Goal', result.goal)}
    ${renderSuggestions(result.suggestions)}
  `;
}

function renderStandardResult(result, score) {
  if (typeof result === 'string') {
    return `
      <div style="margin: 20px 0; text-align: center;">
        ${score !== null && score !== undefined ? `<div style="font-size: 38px; font-weight: 900; color: #0f2c59; margin-bottom: 8px;">${escapeHtml(score)}</div>` : ''}
        <p style="font-size: 16px; font-weight: 600; color: #1e40af;">${escapeHtml(result)}</p>
      </div>
    `;
  }

  const title = result?.title || '';
  const description = result?.description || '';

  return `
    <div style="margin: 20px 0; text-align: center;">
      ${score !== null && score !== undefined ? `<div style="font-size: 40px; font-weight: 900; color: #0f2c59; margin-bottom: 6px;">${escapeHtml(score)}</div>` : ''}
      ${title ? `<div style="font-size: 19px; font-weight: 700; color: #0f2c59; margin-bottom: 10px;">${escapeHtml(title)}</div>` : ''}
      ${description ? `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 auto; max-width: 550px;">${escapeHtml(description)}</p>` : ''}
    </div>

    ${renderInfoBox('Candidate Profile', result?.studentProfile)}
    ${renderInfoBox('Development Goal', result?.goal)}
    ${renderSuggestions(result?.suggestions)}
  `;
}

/**
 * Builds the comprehensive email HTML containing all data shown on the webpage
 */
export function generateAssessmentEmailHtml(submission) {
  const rawResult = submission.result;
  let result = rawResult;
  if (typeof rawResult === 'string') {
    try {
      result = JSON.parse(rawResult);
    } catch {
      result = rawResult;
    }
  }

  const testKey = submission.test_key || '';
  const testName = submission.test_name || 'Assessment';
  const candidateName = submission.name || 'Candidate';

  // Candidate Details Table
  const candidateDetailsRows = [
    ['Candidate Name', candidateName],
    ['Email', submission.email],
    ['Phone', submission.phone],
    ['School / Institution', submission.institution],
    ['Class / Designation', submission.course],
    ['Parent / Guardian', submission.occupation],
    ['City / State', [submission.city, submission.state].filter(Boolean).join(', ')],
  ].filter(([_, val]) => Boolean(val && String(val).trim()));

  const candidateTableHtml = `
    <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #334155; border-collapse: collapse;">
      ${candidateDetailsRows.map(([label, val]) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td width="35%" style="font-weight: 600; color: #64748b; padding: 6px 8px;">${escapeHtml(label)}:</td>
          <td style="font-weight: 500; color: #0f172a; padding: 6px 8px;">${escapeHtml(val)}</td>
        </tr>
      `).join('')}
    </table>
  `;

  // Render Test-specific Result Section
  let resultSectionHtml = '';
  if (result && typeof result === 'object') {
    if (testKey === 'belbin' || result.roleDetails || (result.primaryRole && result.secondaryRole)) {
      resultSectionHtml = renderBelbinResult(result);
    } else if (testKey === 'mcclelland' || result.motivationDetails || result.dominantNeed) {
      resultSectionHtml = renderMcClellandResult(result);
    } else if (testKey === 'mbti' || result.dimensionScores || result.type) {
      resultSectionHtml = renderMBTIResult(result);
    } else if (result.breakdown && Array.isArray(result.breakdown)) {
      resultSectionHtml = renderBreakdownResult(result, submission.score);
    } else {
      resultSectionHtml = renderStandardResult(result, submission.score);
    }
  } else {
    resultSectionHtml = renderStandardResult(result, submission.score);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Assessment Report - ${escapeHtml(testName)} | ATDC</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 44, 89, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f2c59; padding: 28px 24px; text-align: center; color: #ffffff; background-image: linear-gradient(135deg, #0f2c59 0%, #1e40af 100%);">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; color: #93c5fd; margin-bottom: 6px;">ATDC Assessment Portal</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; line-height: 1.3; color: #ffffff;">Official Psychometric Assessment Report</h1>
              <div style="font-size: 14px; margin-top: 8px; color: #e2e8f0; font-weight: 500;">${escapeHtml(testName)}</div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 24px 28px;">
              <p style="font-size: 15px; color: #1e293b; margin-top: 0; margin-bottom: 16px;">
                Dear <strong>${escapeHtml(candidateName)}</strong>,
              </p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
                Thank you for completing your evaluation for <strong>${escapeHtml(testName)}</strong>. Below is your official diagnostic assessment summary, detailed competency breakdown, and personalized recommendations from Advanced Training &amp; Development Consultant (ATDC).
              </p>

              <!-- Candidate Info Card -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #0f2c59; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  Candidate Profile Details
                </div>
                ${candidateTableHtml}
              </div>

              <!-- Test Specific Evaluation Section -->
              <div style="border-top: 2px solid #f1f5f9; padding-top: 20px;">
                ${resultSectionHtml}
              </div>

              <!-- Footer note -->
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
                <p style="margin: 0 0 6px 0;">This assessment report is generated securely via the ATDC Psychometric Framework.</p>
                <p style="margin: 0; font-weight: 700; color: #0f2c59;">Advanced Training &amp; Development Consultant (ATDC) &bull; www.atdc.com</p>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

