import Hospital from "../models/Hospital.models.js";
import { simulateHospital } from "../simulation/simulateHospital.simulation.js";
import { getMLPredictionForHospital } from "../integration/mlforecast.client.js";

export async function simulateOneWithML(req, res) {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findOne({ id }).lean();

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // ✅ ML with safe fallback
    let mlPrediction;
    try {
      mlPrediction = await getMLPredictionForHospital(hospital);
    } catch (err) {
      console.warn("ML failed, falling back to deterministic simulation");
      const fallback = simulateHospital(hospital);
      return res.json({
        ...fallback,
        ml: null,
        note: "ML unavailable, deterministic fallback used",
      });
    }

    const result = simulateHospital(hospital, mlPrediction);
    return res.json(result);
  } catch (err) {
    console.error("simulateOneWithML error:", err);
    return res.status(500).json({ error: "ML simulation failed" });
  }
}
