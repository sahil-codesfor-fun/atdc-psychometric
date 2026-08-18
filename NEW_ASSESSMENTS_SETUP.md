# New Psychometric Assessments — Implementation Notes

This build adds three assessments to the existing Geeta Personality Portal without changing the existing visual theme:

1. Meredith Belbin Team Role Assessment — authorized 8-role Self-Perception Inventory supplied with the project material.
2. McClelland Motivation Profile — authorized 44-item Work Analysis Questionnaire and supplied scoring sheet.
3. Myers-Briggs Type Indicator (MBTI) — authorized 93-item questionnaire and supplied results-sheet scoring grid.

## What is implemented

- Original supplied question wording is used for all three assessments.
- Belbin uses seven sections and requires exactly 10 points per section, with 1–3 statements receiving points.
- Belbin scoring maps each statement to the supplied SH/CO/PL/RI/ME/IMP/TW/CF scoring grid and returns primary and secondary roles.
- McClelland uses the supplied Achievement, Affiliation and Power item groups and calculates 8-item totals (maximum 40 each).
- MBTI uses the supplied 93-question form and the supplied answer-to-dimension scoring grid to calculate E/I, S/N, T/F and J/P and the resulting four-letter type.
- The existing Geeta maroon theme (#841844), cards, controls, typography and general layout are preserved.
- Results are shown immediately on screen.
- Results are submitted to the existing database endpoint.
- Raw responses are stored in `submissions.responses` and also normalized into `submission_responses`.
- The existing admin test/date filtering automatically includes the three new tests.
- Admin submission details include a collapsible view of saved raw responses.
- Email delivery uses the existing SMTP configuration and includes the assessment result/profile.

## Database

`/scripts/migrate.js` has been updated to add:

- `submissions.state`
- `submissions.responses`
- `submission_responses` table

The submission API also performs a one-time schema check before saving a submission, so the required columns/table can be created automatically if the database user has ALTER/CREATE permissions.

## Environment

Keep the existing environment variables used by the portal, especially:

- `DATABASE_URL`
- `EMAIL_USER`
- `EMAIL_PASS`

No new npm package is required for these assessments.

## Files added/changed for this feature

- `src/data/additionalTests.js`
- `src/data.js`
- `src/app/(main)/test/page.js`
- `src/app/(main)/page.js`
- `src/app/(main)/admin/page.js`
- `src/app/api/submit-details/route.js`
- `scripts/migrate.js`

## Verification performed

Static JavaScript syntax checks were run on the new data/scoring module, submission API and migration script. The MBTI scoring grid was checked against all 93 supplied question numbers; every question has an A/B scoring mapping. Belbin contains 7 sections × 8 statements and the supplied role mapping. McClelland contains all 44 supplied items.

Run the normal project build locally/CI with the project's existing Node/Next.js environment before production deployment.
