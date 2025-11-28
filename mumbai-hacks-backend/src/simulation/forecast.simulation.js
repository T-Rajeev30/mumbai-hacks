import { simulateHospital } from "./simulateHospital.simulation.js";
import { evaluateAlerts } from "./evaluateAlerts.js";

// growth damping to avoid runaway
const DAMPING = 0.85;
const MAX_MULTIPLIER = 1.6;

function nextDayLoad(prevLoad, trendFactor) {
  const growth = Math.max(-0.2, Math.min(trendFactor, 0.3));
  return prevLoad * (1 + growth * DAMPING);
}

export function forecastHospital(hospital, days = 7) {
  const base = simulateHospital(hospital);

  const beds = hospital.resources?.beds || 1;
  const vents = hospital.resources?.ventilators || 1;

  const results = [];
  let load = base.predictedLoad;

  for (let d = 1; d <= days; d++) {
    load = nextDayLoad(load, base.trendFactor);

    // cap unrealistic growth
    load = Math.min(load, beds * MAX_MULTIPLIER);

    const bedUtil = load / beds;
    const ventUtil = (load * 0.05) / vents;

    const riskScore = Math.min(1, bedUtil * 0.6 + ventUtil * 0.4);

    const alerts = evaluateAlerts({
      bedUtilization: bedUtil,
      ventilatorUtilization: ventUtil,
      riskScore,
    });

    results.push({
      day: d,
      predictedLoad: Math.round(load),
      bedUtilization: bedUtil.toFixed(2),
      ventilatorUtilization: ventUtil.toFixed(2),
      riskScore: riskScore.toFixed(2),
      alerts,
    });
  }

  return {
    hospitalId: hospital.id,
    today: base,
    forecast: results,
  };
}
