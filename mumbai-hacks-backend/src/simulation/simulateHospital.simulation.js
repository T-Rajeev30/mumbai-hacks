import { calculateTrends } from "./calculateTrends.simulation.js";
import { applyModifiers } from "./applyModifiers.simulation.js";
import { evaluateAlerts } from "./evaluateAlerts.js";

/**
 * @param {Object} hospital  - hospital document
 * @param {Object} [mlPrediction] - optional ML quantiles { lower, median, upper }
 */
export function simulateHospital(hospital, mlPrediction) {
  // 1) Trends from past week
  const { movingAvg, trendFactor } = calculateTrends(
    hospital.pastWeekData || []
  );

  // 2) Baseline simulated load (deterministic)
  let simulatedBaseLoad = movingAvg * (1 + trendFactor);

  // 3) Apply dynamic environment modifiers (pollution/festival/weather)
  simulatedBaseLoad = applyModifiers(simulatedBaseLoad, hospital);

  const beds = hospital.resources?.beds || 1;
  const ventilators = hospital.resources?.ventilators || 1;

  // 4) Choose effective base load
  //    - If ML is provided → use ML median as base
  //    - Else → use deterministic simulatedBaseLoad
  let baseLoad = simulatedBaseLoad;
  let mlDetails = null;

  if (mlPrediction && typeof mlPrediction.median === "number") {
    baseLoad = mlPrediction.median;
    mlDetails = {
      lower: mlPrediction.lower ?? null,
      median: mlPrediction.median,
      upper: mlPrediction.upper ?? null,
    };
  }

  // 5) Utilization (numeric)
  const bedUtilization = baseLoad / beds;
  const ventilatorUtilization = (baseLoad * 0.05) / ventilators;

  // 6) Risk score (numeric)
  const riskScore = Math.min(
    1,
    bedUtilization * 0.6 + ventilatorUtilization * 0.4
  );

  // 7) Status
  let status = "LOW_RISK";
  if (riskScore > 0.7) status = "HIGH_RISK";
  else if (riskScore > 0.4) status = "MEDIUM_RISK";

  // 8) Alerts (we’ll enhance this in step 2 with ML upper)
  const alerts = evaluateAlerts({
    bedUtilization,
    ventilatorUtilization,
    riskScore,
    beds,
    ventilators,
    mlUpper: mlDetails?.upper ?? null,
  });

  // 9) Final result
  return {
    id: hospital.id,
    predictedLoad: Math.round(baseLoad),
    movingAvg,
    trendFactor,
    bedUtilization: bedUtilization.toFixed(2),
    ventilatorUtilization: ventilatorUtilization.toFixed(2),
    riskScore: riskScore.toFixed(2),
    status,
    alerts,
    ml: mlDetails, // <-- ML context (optional)
    simulatedBaseLoad: Math.round(simulatedBaseLoad), // for debugging/compare
  };
}
