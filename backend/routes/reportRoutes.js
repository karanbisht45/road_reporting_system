import express from "express";
import multer from "multer";
import path from "path";
import Report from "../models/report.js";

const router = express.Router();

// Multer storage setup (store files in /uploads folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST route to submit report
router.post("/", upload.single("photo"), async (req, res) => {
    try {
        const { location, description } = req.body;
        const photoPath = req.file ? req.file.path : null;

        const newReport = new Report({
            location,
            description,
            photo: photoPath
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit report" });
    }
});

export default router;
