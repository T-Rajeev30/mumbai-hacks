import Hospital from "../models/Hospital.models.js";
import { simulateHospital } from "../simulation/simulateHospital.simulation.js";
import { simulateAllHospitals } from "../simulation/simulateAllHospitals.simulation.js";

export async function simulateAll(req, res) {
  try {
    const results = await simulateAllHospitals();
    return res.status(200).json({
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: "Simulation failed" });
  }
}

export async function simulateOne(req, res) {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findOne({ id });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const result = simulateHospital(hospital);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: "Simulation failed" });
  }
}
