import { simulateHospital } from "./simulateHospital.simulation.js";
import Hospital from "../models/Hospital.models.js";

/**
 * Aggregate simulation results for an array of simulation outputs.
 * groups: { city, state } => totals, averages, risk distribution
 */
function rollupGroup(results) {
  const out = {
    totalHospitals: results.length,
    totalPredictedLoad: 0,
    avgPredictedLoad: 0,
    avgBedUtilization: 0,
    avgVentilatorUtilization: 0,
    riskCounts: { LOW_RISK: 0, MEDIUM_RISK: 0, HIGH_RISK: 0 },
  };

  if (results.length === 0) return out;

  for (const r of results) {
    out.totalPredictedLoad += r.predictedLoad || 0;
    out.avgBedUtilization += parseFloat(r.bedUtilization || 0);
    out.avgVentilatorUtilization += parseFloat(r.ventilatorUtilization || 0);
    out.riskCounts[r.status] = (out.riskCounts[r.status] || 0) + 1;
  }

  out.avgPredictedLoad = Math.round(out.totalPredictedLoad / results.length);
  out.avgBedUtilization = +(out.avgBedUtilization / results.length).toFixed(2);
  out.avgVentilatorUtilization = +(
    out.avgVentilatorUtilization / results.length
  ).toFixed(2);

  return out;
}

/**
 * simulate & aggregate by city/state
 * options: { by: "city"|"state"|"all" }
 */
export async function aggregateSimulations({ by = "city" } = {}) {
  const hospitals = await Hospital.find({}).lean();

  // simulate every hospital
  const sims = hospitals.map((h) => {
    // ensure simulateHospital can accept plain object as produced by mongoose .lean()
    return simulateHospital(h);
  });

  // group
  const groups = {};
  for (let i = 0; i < hospitals.length; i++) {
    const h = hospitals[i];
    const sim = sims[i];

    const city = h.location && h.location.city ? h.location.city : "Unknown";
    const state = h.location && h.location.state ? h.location.state : "Unknown";

    if (by === "city" || by === "all") {
      groups.city = groups.city || {};
      groups.city[city] = groups.city[city] || [];
      groups.city[city].push(sim);
    }

    if (by === "state" || by === "all") {
      groups.state = groups.state || {};
      groups.state[state] = groups.state[state] || [];
      groups.state[state].push(sim);
    }
  }

  // rollups
  const rollups = {};
  if (groups.city) {
    rollups.cities = Object.entries(groups.city).map(([city, arr]) => ({
      city,
      summary: rollupGroup(arr),
      hospitals: arr.length,
    }));
  }
  if (groups.state) {
    rollups.states = Object.entries(groups.state).map(([state, arr]) => ({
      state,
      summary: rollupGroup(arr),
      hospitals: arr.length,
    }));
  }

  // also provide overall summary
  rollups.overall = rollupGroup(sims);

  return rollups;
}

/**
 * Aggregate for a single city
 */
export async function aggregateByCity(cityName) {
  const hospitals = await Hospital.find({ "location.city": cityName }).lean();
  const sims = hospitals.map((h) => simulateHospital(h));
  return {
    city: cityName,
    summary: rollupGroup(sims),
    hospitals: sims.length,
    hospitalsDetail: sims,
  };
}

/**
 * Aggregate for a single state
 */
export async function aggregateByState(stateName) {
  const hospitals = await Hospital.find({ "location.state": stateName }).lean();
  const sims = hospitals.map((h) => simulateHospital(h));
  return {
    state: stateName,
    summary: rollupGroup(sims),
    hospitals: sims.length,
    hospitalsDetail: sims,
  };
}
