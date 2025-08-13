// backend/models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // store image path or URL
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);
