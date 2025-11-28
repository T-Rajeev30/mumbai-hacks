import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Hospital from "../src/models/Hospital.models.js";

dotenv.config(); // Load .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get connection string from .env
const MONGO_URI = process.env.MONGO_URI;

async function seedHospitals() {
  try {
    console.log("Connecting to MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI);

    console.log("Connected");

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
          coordinates: [h.location.lon, h.location.lat],
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
