import { calculateTrends } from "./calculateTrends.simulation.js";
import { applyModifiers } from "./applyModifiers.simulation.js";
import { evaluateAlerts } from "./evaluateAlerts.js";

/**
 * @param {Object} hospital  - hospital document
 * @param {Object} [mlPrediction] - optional ML quantiles { lower, median, upper }
 */
export function simulateHospital(hospital, ml = null) {
  const beds = hospital.resources?.beds || 500;

  // Deterministic base
  const movingAvg =
    hospital.pastWeekData?.reduce((a, b) => a + b, 0) / 7 || 200;
  const trendFactor = hospital.pastWeekData
    ? (hospital.pastWeekData[6] - hospital.pastWeekData[0]) /
      hospital.pastWeekData[0]
    : 0;

  const simulatedBaseLoad = Math.max(
    0,
    Math.round(movingAvg * (1 + trendFactor))
  );

  // ✅ ML overrides base load IF present
  const predictedLoad = ml?.median ? Math.round(ml.median) : simulatedBaseLoad;

  const bedUtilization = predictedLoad / beds;
  const riskScore = Math.min(1, bedUtilization * 0.9);

  const alerts = [];

  // Deterministic alerts
  if (bedUtilization >= 0.85) {
    alerts.push({ type: "BED_CAPACITY", level: "CRITICAL", source: "current" });
  }

  // ✅ ML uncertainty-aware alerts
  if (ml?.upper && ml.upper / beds >= 0.85) {
    alerts.push({
      type: "BED_CAPACITY",
      level: "CRITICAL",
      source: "ml_upper",
    });
  }

  return {
    id: hospital.id,
    predictedLoad,
    movingAvg,
    trendFactor,
    bedUtilization: bedUtilization.toFixed(2),
    ventilatorUtilization: (bedUtilization * 0.9).toFixed(2),
    riskScore: riskScore.toFixed(2),
    status: riskScore > 0.7 ? "HIGH_RISK" : "LOW_RISK",
    alerts,
    ml,
    simulatedBaseLoad,
  };
}
