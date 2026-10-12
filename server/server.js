const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zerowaste_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL Database!');
  }
});

// 1. User Registration Route
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users (name, email, password, eco_points) VALUES (?, ?, ?, 0)';
  
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already registered!' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
});

// 2. User Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = results[0];
    res.json({ message: 'Login successful', userId: user.id, email: user.email, name: user.name, eco_points: user.eco_points });
  });
});

// 3. Save Trip & Update Eco Points & Badges
app.post('/api/trips', (req, res) => {
  const { user_id, destination, trip_type, days, members, start_date, budget_level, transport_mode } = req.body;
  
  const plasticSaved = days * members * 2;
  const ecoPointsEarned = plasticSaved * 10;

  const insertTripQuery = `
    INSERT INTO trips (user_id, destination, trip_type, days, members, start_date, budget_level, transport_mode, plastic_saved) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertTripQuery, [user_id || 1, destination, trip_type, days, members, start_date, budget_level, transport_mode, plasticSaved], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save trip' });
    }

    // Update user eco points
    const updatePointsQuery = 'UPDATE users SET eco_points = eco_points + ? WHERE id = ?';
    db.query(updatePointsQuery, [ecoPointsEarned, user_id || 1]);

    res.status(201).json({ message: 'Trip planned successfully!', plasticSaved, ecoPointsEarned });
  });
});

// 4. Fetch User Trips History
app.get('/api/trips', (req, res) => {
  const query = 'SELECT * FROM trips ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching trips' });
    res.json(results);
  });
});

// 5. Fetch Packing Items by Trip Type
app.get('/api/items/:type', (req, res) => {
  const { type } = req.params;
  const query = 'SELECT * FROM packing_items WHERE item_type = ? OR item_type = "General"';
  db.query(query, [type], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching items' });
    res.json(results);
  });
});

// 6. User Stats & Badges API Endpoint
app.get('/api/user/stats/:userId', (req, res) => {
  const { userId } = req.params;
  
  const statsQuery = `
    SELECT 
      COALESCE(SUM(plastic_saved), 0) AS total_plastic_saved,
      COUNT(id) AS total_trips
    FROM trips WHERE user_id = ?
  `;

  db.query(statsQuery, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching stats' });
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});