import Hospital from "../models/Hospital.models.js";
import { forecastHospital } from "../simulation/forecastMl.simulation.js";
import { getMLPredictionForHospital } from "../integration/mlforecast.client.js";

export async function forecastOneWithML(req, res) {
  try {
    const days = Number(req.query.days || 7);
    const { id } = req.params;

    const hospital = await Hospital.findOne({ id }).lean();
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const mlPrediction = await getMLPredictionForHospital(hospital);

    const result = forecastHospital(hospital, days, mlPrediction);

    return res.status(200).json(result);
  } catch (err) {
    console.error("forecastOneWithML error:", err);
    return res.status(500).json({ error: "ML forecast failed" });
  }
}
