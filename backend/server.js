import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Static folder to serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Report Schema
const reportSchema = new mongoose.Schema({
    location: String,
    description: String,
    photo: String,
    date: { type: Date, default: Date.now }
});
const Report = mongoose.model("Report", reportSchema);

// POST route for reports
app.post("/api/reports", upload.single("photo"), async (req, res) => {
    try {
        const newReport = new Report({
            location: req.body.location,
            description: req.body.description,
            photo: req.file ? req.file.filename : null
        });
        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("🚀 Backend is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
