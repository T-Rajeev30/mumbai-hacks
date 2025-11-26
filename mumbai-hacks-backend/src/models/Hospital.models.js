import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: String,
    capacity: Number,
    doctors: Number,
    nurses: Number,
  },
  { _id: false }
);

const pastWeekSchema = new mongoose.Schema(
  {
    day: String,
    patients: Number,
    surgeries: Number,
    emergencies: Number,
  },
  { _id: false }
);

// MAIN hospital schema
const hospitalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },

  // Keep your geo-location ability + match generated structure
  location: {
    lat: Number,
    lon: Number,
    city: String,
    state: String,

    // GeoJSON point for 2dsphere index
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lon, lat]
        default: [0, 0],
      },
    },
  },

  baselinePatients: Number,

  departments: [departmentSchema],

  resources: {
    beds: Number,
    ventilators: Number,
    oxygen: Number,
    ambulances: Number,
  },

  pastWeekData: [pastWeekSchema],

  pollutionSensitivity: Number,
  festivalSensitivity: Number,
  weatherSensitivity: Number,

  lastUpdated: { type: Date, default: Date.now },
});

// Add geo index
hospitalSchema.index({ "location.geo": "2dsphere" });

export default mongoose.model("Hospital", hospitalSchema, "hospitals");
