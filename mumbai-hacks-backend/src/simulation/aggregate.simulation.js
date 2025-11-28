import Hospital from "../models/Hospital.models.js";
import { simulateHospital } from "./simulateHospital.simulation.js";

// ----------------------------
// Helper: roll up a group
// ----------------------------
function rollupGroup(results) {
  const out = {
    totalHospitals: results.length,
    totalPredictedLoad: 0,
    avgPredictedLoad: 0,
    avgBedUtilization: 0,
    avgVentilatorUtilization: 0,
    riskCounts: {
      LOW_RISK: 0,
      MEDIUM_RISK: 0,
      HIGH_RISK: 0,
    },
    alerts: {
      WARNING: 0,
      CRITICAL: 0,
    },
  };

  if (results.length === 0) return out;

  for (const r of results) {
    out.totalPredictedLoad += r.predictedLoad || 0;
    out.avgBedUtilization += parseFloat(r.bedUtilization || 0);
    out.avgVentilatorUtilization += parseFloat(r.ventilatorUtilization || 0);

    if (r.status) {
      out.riskCounts[r.status] += 1;
    }

    // ✅ ALERT AGGREGATION
    if (r.alerts && Array.isArray(r.alerts)) {
      r.alerts.forEach((a) => {
        if (a.level === "CRITICAL") out.alerts.CRITICAL += 1;
        if (a.level === "WARNING") out.alerts.WARNING += 1;
      });
    }
  }

  out.avgPredictedLoad = Math.round(out.totalPredictedLoad / results.length);
  out.avgBedUtilization = parseFloat(
    (out.avgBedUtilization / results.length).toFixed(2)
  );
  out.avgVentilatorUtilization = parseFloat(
    (out.avgVentilatorUtilization / results.length).toFixed(2)
  );

  return out;
}

// ----------------------------
// Aggregate ALL (city + state + overall)
// ----------------------------
export async function aggregateSimulations({ by = "all" } = {}) {
  const hospitals = await Hospital.find({}).lean();

  const simulations = hospitals.map((h) => simulateHospital(h));

  const cityMap = {};
  const stateMap = {};

  hospitals.forEach((h, idx) => {
    const sim = simulations[idx];

    const city = h.location?.city || "UNKNOWN";
    const state = h.location?.state || "UNKNOWN";

    cityMap[city] = cityMap[city] || [];
    cityMap[city].push(sim);

    stateMap[state] = stateMap[state] || [];
    stateMap[state].push(sim);
  });

  const result = {
    overall: rollupGroup(simulations),
  };

  if (by === "city" || by === "all") {
    result.cities = Object.entries(cityMap).map(([city, sims]) => ({
      city,
      hospitals: sims.length,
      summary: rollupGroup(sims),
    }));
  }

  if (by === "state" || by === "all") {
    result.states = Object.entries(stateMap).map(([state, sims]) => ({
      state,
      hospitals: sims.length,
      summary: rollupGroup(sims),
    }));
  }

  return result;
}

// ----------------------------
// Aggregate single CITY
// ----------------------------
export async function aggregateByCity(cityName) {
  const hospitals = await Hospital.find({ "location.city": cityName }).lean();
  const simulations = hospitals.map((h) => simulateHospital(h));

  return {
    city: cityName,
    hospitals: simulations.length,
    summary: rollupGroup(simulations),
    hospitalDetails: simulations,
  };
}

// ----------------------------
// Aggregate single STATE
// ----------------------------
export async function aggregateByState(stateName) {
  const hospitals = await Hospital.find({ "location.state": stateName }).lean();
  const simulations = hospitals.map((h) => simulateHospital(h));

  return {
    state: stateName,
    hospitals: simulations.length,
    summary: rollupGroup(simulations),
    hospitalDetails: simulations,
  };
}
