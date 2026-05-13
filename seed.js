require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Render
});

const measurements = [
  { unit_id: 1, temperature: 1.2, unix_timestamp: 1747017600 },
  { unit_id: 2, temperature: -0.5, unix_timestamp: 1747021200 },
  { unit_id: 1, temperature: 2.1, unix_timestamp: 1747024800 },
  { unit_id: 3, temperature: -2.3, unix_timestamp: 1747028400 },
  { unit_id: 2, temperature: 0.8, unix_timestamp: 1747032000 },
  { unit_id: 1, temperature: 1.9, unix_timestamp: 1747035600 },
  { unit_id: 3, temperature: -1.1, unix_timestamp: 1747039200 }
];

async function seed() {
  try {
    // Create table if not exists (optional – you can do manually first)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS measurements (
        id SERIAL PRIMARY KEY,
        unit_id INTEGER NOT NULL,
        temperature DECIMAL(3,1) NOT NULL,
        unix_timestamp BIGINT NOT NULL
      )
    `);
    // Clear existing data (optional)
    //await pool.query('DELETE FROM measurements');
    // Insert new rows
    for (const m of measurements) {
      await pool.query(
        'INSERT INTO measurements (unit_id, temperature, unix_timestamp) VALUES ($1, $2, $3)',
        [m.unit_id, m.temperature, m.unix_timestamp]
      );
    }
    console.log('Seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();