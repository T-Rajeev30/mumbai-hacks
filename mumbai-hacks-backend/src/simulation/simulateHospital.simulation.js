import { calculateTrends } from "./calculateTrends.simulation.js";
import { applyModifiers } from "./applyModifiers.simulation.js";
import { evaluateAlerts } from "./evaluateAlerts.js";

export function simulateHospital(hospital) {
  // 1️⃣ Trends
  const { movingAvg, trendFactor } = calculateTrends(
    hospital.pastWeekData || []
  );

  // 2️⃣ Base prediction
  let predictedLoad = movingAvg * (1 + trendFactor);

  // 3️⃣ Apply dynamic modifiers
  predictedLoad = applyModifiers(predictedLoad, hospital);

  // 4️⃣ Resources
  const beds = hospital.resources?.beds || 1;
  const ventilators = hospital.resources?.ventilators || 1;

  // 5️⃣ Utilization (NUMBERS ONLY here)
  const bedUtilization = predictedLoad / beds;
  const ventilatorUtilization = (predictedLoad * 0.05) / ventilators;

  // 6️⃣ Risk score (DEFINE BEFORE USE)
  const riskScore = Math.min(
    1,
    bedUtilization * 0.6 + ventilatorUtilization * 0.4
  );

  // 7️⃣ Status
  let status = "LOW_RISK";
  if (riskScore > 0.7) status = "HIGH_RISK";
  else if (riskScore > 0.4) status = "MEDIUM_RISK";

  // 8️⃣ Alerts (NOW safe to evaluate)
  const alerts = evaluateAlerts({
    bedUtilization,
    ventilatorUtilization,
    riskScore,
  });

  // 9️⃣ Final output (string formatting only here)
  return {
    id: hospital.id,
    predictedLoad: Math.round(predictedLoad),
    movingAvg,
    trendFactor,
    bedUtilization: bedUtilization.toFixed(2),
    ventilatorUtilization: ventilatorUtilization.toFixed(2),
    riskScore: riskScore.toFixed(2),
    status,
    alerts,
  };
}
