import Hospital from "../models/Hospital.models.js";
import { forecastHospital } from "../simulation/forecast.simulation.js";

// All hospitals
export async function forecastAll(req, res) {
  const days = Number(req.query.days || 7);
  const hospitals = await Hospital.find({}).lean();

  const out = hospitals.map((h) => forecastHospital(h, days));
  res.json({ days, count: out.length, results: out });
}

// Single hospital
export async function forecastOne(req, res) {
  const days = Number(req.query.days || 7);
  const h = await Hospital.findOne({ id: req.params.id }).lean();
  if (!h) return res.status(404).json({ error: "Hospital not found" });

  res.json(forecastHospital(h, days));
}
