import { calculateTrends } from "./calculateTrends.simulation.js";
import { applyModifiers } from "./applyModifiers.simulation.js";

export function simulateHospital(hospital) {
  const { movingAvg, trendFactor } = calculateTrends(hospital.pastWeekData);

  // Step 1: base predicted load
  let predictedLoad = movingAvg * (1 + trendFactor);

  // Step 2: apply environment modifiers
  predictedLoad = applyModifiers(predictedLoad, hospital);

  // Step 3: compute capacity strain
  const { beds, ventilators } = hospital.resources;

  const bedUtilization = predictedLoad / beds;
  const ventilatorUtilization = (predictedLoad * 0.05) / ventilators; // assume 5% need vents

  // Step 4: risk scoring
  const riskScore = Math.min(
    1,
    bedUtilization * 0.6 + ventilatorUtilization * 0.4
  );

  let status = "LOW_RISK";
  if (riskScore > 0.7) status = "HIGH_RISK";
  else if (riskScore > 0.4) status = "MEDIUM_RISK";

  return {
    id: hospital.id,
    predictedLoad: Math.round(predictedLoad),
    movingAvg,
    trendFactor,
    bedUtilization: bedUtilization.toFixed(2),
    ventilatorUtilization: ventilatorUtilization.toFixed(2),
    riskScore: riskScore.toFixed(2),
    status,
  };
}
