/*const mongoose = require('mongoose');

exports.connectToDatabase = async function() {
    await mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DATABASE);
};*/

const { Pool } = require('pg');

let pool = null;

exports.connectToDatabase = async function() {
  if (pool) return pool; // already connected

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    //ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    ssl: { rejectUnauthorized: false }   // always on for testing
  });

  // connection testing
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected');
    return pool;
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
};

exports.getPool = () => pool;