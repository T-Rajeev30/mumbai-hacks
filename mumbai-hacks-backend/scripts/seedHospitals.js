import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Hospital from "../src/models/Hospital.models.js";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Replace with your actual MongoDB URI
const MONGO_URI = "mongodb://127.0.0.1:27017/mumbaiHacks";

async function seedHospitals() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected");

    // Read dev.json (100 hospitals)
    const filePath = path.join(__dirname, "../data/hospitals/dev.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    let hospitals = JSON.parse(rawData);

    // Convert lat/lon -> GeoJSON
    hospitals = hospitals.map((h) => ({
      ...h,
      location: {
        ...h.location,
        geo: {
          type: "Point",
          coordinates: [h.location.lon, h.location.lat], // GeoJSON format
        },
      },
    }));

    console.log("Clearing old hospitals...");
    await Hospital.deleteMany({});

    console.log("Inserting new hospitals...");
    await Hospital.insertMany(hospitals);

    console.log("SUCCESS: Inserted", hospitals.length, "hospitals.");
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

seedHospitals();
