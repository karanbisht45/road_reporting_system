const express = require("express");
const multer = require("multer");
const Report = require("../models/report"); // Make sure you have a Report schema
const jwt = require("jsonwebtoken");
const router = express.Router();

// ===== Multer setup for file uploads =====
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ===== Middleware: verify JWT =====
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Invalid token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Failed to authenticate token" });
    req.user = { id: decoded.id };
    next();
  });
}

// ===== Submit report =====
router.post("/", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    const { description, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    const report = await Report.create({
      userId: req.user.id,
      description,
      location,
      photo,
      date: new Date()
    });

    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Fetch all reports =====
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().populate("userId", "username").sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
