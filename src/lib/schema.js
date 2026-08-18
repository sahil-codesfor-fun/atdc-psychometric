import db from './db.js';

let schemaReady;

export async function ensureSchema() {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    // 1. Create main submissions table if not existing
    await db.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        dob DATE,
        course VARCHAR(255),
        married TINYINT(1) DEFAULT 0,
        education VARCHAR(255),
        religion VARCHAR(100),
        gender VARCHAR(50),
        email VARCHAR(255),
        occupation VARCHAR(255),
        phone VARCHAR(50),
        institution VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        rural_or_urban VARCHAR(50),
        test_name VARCHAR(255),
        score INT,
        result TEXT,
        responses LONGTEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create submission_responses table if not existing
    await db.execute(`
      CREATE TABLE IF NOT EXISTS submission_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        question_number INT NULL,
        section_label VARCHAR(50) NULL,
        question_text TEXT NULL,
        selected_value TEXT NULL,
        score_value DECIMAL(10,2) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_submission_id (submission_id)
      )
    `);

    // 3. Safely ensure optional columns exist on submissions table
    const [columns] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions'
    `);
    const names = new Set((columns || []).map((c) => c.COLUMN_NAME));
    if (!names.has('responses')) await db.execute(`ALTER TABLE submissions ADD COLUMN responses LONGTEXT NULL`);
    if (!names.has('state')) await db.execute(`ALTER TABLE submissions ADD COLUMN state VARCHAR(255) NULL`);
    return true;
  })().catch((error) => {
    schemaReady = null;
    console.error('⚠️ [DB Schema Error] Failed to ensure database schema:', error?.message || error);
    throw error;
  });
  return schemaReady;
}
