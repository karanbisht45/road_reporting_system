const express = require('express');
const router = express.Router();

// Sample in-memory data (will be replaced with DB later)
let reports = [
  { id: 1, title: 'Pothole on Main Street', location: 'Sector 12', status: 'Pending' },
  { id: 2, title: 'Broken Streetlight', location: 'Sector 7', status: 'Resolved' }
];

// GET all reports
router.get('/', (req, res) => {
  res.json(reports);
});

// POST a new report
router.post('/', (req, res) => {
  const newReport = {
    id: reports.length + 1,
    title: req.body.title,
    location: req.body.location,
    status: 'Pending'
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

module.exports = router;
