
// Import required modules

require('dotenv').config();   
const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();


app.use(cors());              
app.use(express.json());      
app.use('/api/books', bookRoutes);


app.get('/', (req, res) => {
  res.send('Hello from Library Backend!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
