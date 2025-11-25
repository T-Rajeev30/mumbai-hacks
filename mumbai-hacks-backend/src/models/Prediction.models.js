import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  timestamp: { type: Date, default: Date.now },
  metric: String,
  value: mongoose.Schema.Types.Mixed,
  tags: [String],
});

export default mongoose.model("Prediction", PredictionSchema);
