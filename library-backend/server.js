// Import required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes'); // Import borrow routes
const db = require('./config/db');  // Import the DB connection

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/books', bookRoutes); // Book-related routes
app.use('/api/borrow', borrowRoutes); // Borrow-related routes

app.get('/', (req, res) => {
  res.send('Hello from Library Backend!');
});

// Ensure database connection before starting the server
async function startServer() {
  try {
    // Test the database connection
    await db.query('SELECT 1'); // Use the pool to run a simple query
    console.log('Database connected successfully');

    // Start the server after the database connection is successful
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Could not connect to database:', err.message);
    process.exit(1);  // Exit the process if the connection fails
  }
}

startServer();
