import {
  aggregateSimulations,
  aggregateByCity,
  aggregateByState,
} from "../simulation/aggregate.simulation.js";

export async function getAggregation(req, res) {
  try {
    const by = req.query.by || "city"; // optional ?by=city|state|all
    const result = await aggregateSimulations({ by });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Aggregation error:", err);
    return res.status(500).json({ error: "Aggregation failed" });
  }
}

export async function getAggregationByCity(req, res) {
  try {
    const { city } = req.params;
    const result = await aggregateByCity(city);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Aggregation by city error:", err);
    return res.status(500).json({ error: "Aggregation failed" });
  }
}

export async function getAggregationByState(req, res) {
  try {
    const { state } = req.params;
    const result = await aggregateByState(state);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Aggregation by state error:", err);
    return res.status(500).json({ error: "Aggregation failed" });
  }
}
