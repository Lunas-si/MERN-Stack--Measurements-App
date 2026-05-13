const router = require('express').Router();

//const { Measurement } = require('../models/measurements.model'); 
const { getPool } = require('../../database');

/*router.get('/api/measurements', async (req, res) => {
    const measurements = await Measurement.find({})
    .sort({ unix_timestamp: -1 })  
    .limit(5);                     
    
    res.send(measurements);
});*/


//postgresql
router.get('/api/measurements', async (req, res) => {
  const pool = getPool();
  try {
   
    const result = await pool.query(
      'SELECT unit_id, temperature, unix_timestamp FROM measurements ORDER BY unix_timestamp DESC LIMIT 5'
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

exports.router = router;