const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON data

// Test route
app.get('/', (req, res) => {
    res.send('RoadFix Backend is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
