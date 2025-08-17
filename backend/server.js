const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Schemas =====
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { type: String, required: true },
  location: { type: String, required: true },
  photo: { type: String },
  date: { type: Date, default: Date.now }
});
const Report = mongoose.model("Report", reportSchema);

// ===== Multer setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ===== JWT middleware =====
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // user.id available
    next();
  });
}

// ===== Routes =====
app.get("/", (req, res) => res.send("🚀 Server is running"));

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit report
app.post("/api/reports", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const { description, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    const report = new Report({ userId: req.user.id, description, location, photo });
    await report.save();

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (err) {
    console.error("Report submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all reports
app.get("/api/reports", authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find().populate("userId", "username").sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Fetch reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
