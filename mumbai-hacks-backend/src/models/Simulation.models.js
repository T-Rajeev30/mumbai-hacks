import mongoose from "mongoose";

const SimulationSchema = new mongoose.Schema({
  name: String,
  params: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: ["pending", "running", "finished", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  results: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("Simulation", SimulationSchema);
