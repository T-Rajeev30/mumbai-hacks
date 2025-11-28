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

    const mlPrediction = await getMLPredictionForHospital(hospital);

    const result = simulateHospital(hospital, mlPrediction);

    return res.status(200).json(result);
  } catch (err) {
    console.error("simulateOneWithML error:", err);
    return res.status(500).json({ error: "ML simulation failed" });
  }
}
