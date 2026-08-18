const axios = require('axios');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
  console.log('Connecting to MySQL...', process.env.DB_HOST);
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('Connected to database!');

    console.log('Creating table if not exists...');
    await connection.execute(`
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

    const [existingColumns] = await connection.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions'`);
    const columnNames = new Set(existingColumns.map((row) => row.COLUMN_NAME));
    if (!columnNames.has('state')) await connection.execute(`ALTER TABLE submissions ADD COLUMN state VARCHAR(255) NULL`);
    if (!columnNames.has('responses')) await connection.execute(`ALTER TABLE submissions ADD COLUMN responses LONGTEXT NULL`);

    await connection.execute(`
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

    console.log('Fetching old data from remote API...');
    const response = await axios.get('https://deeppink-moose-154369.hostingersite.com/');
    const data = response.data;
    console.log(`Found ${data.length} records. Transferring to MySQL...`);

    const query = `
      INSERT INTO submissions (
        name, dob, course, married, education, religion, gender,
        email, occupation, phone, institution, city, rural_or_urban,
        test_name, score, result, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    let inserted = 0;
    for (const item of data) {
      const values = [
        item.name || null,
        item.dob ? new Date(item.dob) : null,
        item.course || null,
        item.married ? 1 : 0,
        item.education || null,
        item.religion || 'not-specified',
        item.gender || null,
        item.email || null,
        item.occupation || null,
        item.phone || null,
        item.institution || null,
        item.city || null,
        item.rural_or_urban || 'not-specified',
        item.test_name || null,
        item.score || 0,
        typeof item.result === 'string' ? item.result : JSON.stringify(item.result),
        item.timestamp ? new Date(item.timestamp) : new Date(),
      ];
      try {
        await connection.execute(query, values);
        inserted++;
      } catch (err) {
        console.error('Error inserting row:', err.message, 'Row:', item.name);
      }
    }

    console.log(`Migration complete! Successfully inserted ${inserted} records.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
