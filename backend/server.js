const express = require('express');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests

// Routes
app.use('/api/reports', reportRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
