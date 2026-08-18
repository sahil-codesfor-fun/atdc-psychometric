require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
    try {
        console.log("Using URL:", process.env.DATABASE_URL);
        const pool = mysql.createPool(process.env.DATABASE_URL);
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM submissions');
        console.log("Success! Row count:", rows[0].count);
        process.exit(0);
    } catch (err) {
        console.error("Database connection failed:");
        console.error(err);
        process.exit(1);
    }
}
test();
