const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '456789', // Your MySQL password
  database: 'zerowaste_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL Database successfully!');
  }
});

// Password Validation Function (Min 5 chars, 1 uppercase, 1 lowercase)
const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isLengthValid = password.length >= 5;
  return hasUpperCase && hasLowerCase && isLengthValid;
};

// 1. User Registration API
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 5 characters long and contain both uppercase (A-Z) and lowercase (a-z) letters.' 
    });
  }

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'This email address is already registered!' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Registration successful!' });
  });
});

// 2. User Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password, or account is not registered.' });
    }

    res.json({ message: 'Login successful!', user: results[0] });
  });
});

// 3. Trips & Items APIs
app.post('/api/trips', (req, res) => {
  const { trip_type, days, members } = req.body;
  const query = 'INSERT INTO trips (trip_type, days, members) VALUES (?, ?, ?)';
  db.query(query, [trip_type, days, members], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Trip saved successfully!', tripId: result.insertId });
  });
});

app.get('/api/trips', (req, res) => {
  const query = 'SELECT * FROM trips ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/items/:type', (req, res) => {
  const tripType = req.params.type; 
  const query = 'SELECT * FROM packing_items WHERE item_type = ? OR item_type = "Both"';
  db.query(query, [tripType], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/items', (req, res) => {
  const { item_name, category, item_type } = req.body;
  const query = 'INSERT INTO packing_items (item_name, category, item_type) VALUES (?, ?, ?)';
  db.query(query, [item_name, category, item_type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Item added successfully!', itemId: result.insertId });
  });
});

app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM packing_items WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted successfully!' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});