import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    location: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String }, // store file path
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", reportSchema);
