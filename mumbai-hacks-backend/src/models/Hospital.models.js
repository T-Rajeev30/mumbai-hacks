import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  beds: { type: Number, default: 0 },
  capacity: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  lastUpdated: { type: Date, default: Date.now },
});

HospitalSchema.index({ location: "2dsphere" });

export default mongoose.model("Hospital", HospitalSchema);
