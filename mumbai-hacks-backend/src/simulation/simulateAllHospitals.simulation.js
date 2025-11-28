import Hospital from "../models/Hospital.models.js";
import { simulateHospital } from "./simulateHospital.simulation.js";

export async function simulateAllHospitals() {
  const hospitals = await Hospital.find({});

  const results = hospitals.map((h) => simulateHospital(h));

  return results;
}
