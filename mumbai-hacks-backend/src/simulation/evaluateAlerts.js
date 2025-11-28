import { THRESHOLDS } from "./thresholds.js";

export function evaluateAlerts(simulationResult) {
  const alerts = [];

  const bed = parseFloat(simulationResult.bedUtilization);
  const vent = parseFloat(simulationResult.ventilatorUtilization);
  const risk = parseFloat(simulationResult.riskScore);

  if (bed >= THRESHOLDS.bedUtilization.critical) {
    alerts.push({ type: "BED_CAPACITY", level: "CRITICAL" });
  } else if (bed >= THRESHOLDS.bedUtilization.warning) {
    alerts.push({ type: "BED_CAPACITY", level: "WARNING" });
  }

  if (vent >= THRESHOLDS.ventilatorUtilization.critical) {
    alerts.push({ type: "VENTILATOR_CAPACITY", level: "CRITICAL" });
  } else if (vent >= THRESHOLDS.ventilatorUtilization.warning) {
    alerts.push({ type: "VENTILATOR_CAPACITY", level: "WARNING" });
  }

  if (risk >= THRESHOLDS.riskScore.critical) {
    alerts.push({ type: "OVERALL_SURGE", level: "CRITICAL" });
  } else if (risk >= THRESHOLDS.riskScore.warning) {
    alerts.push({ type: "OVERALL_SURGE", level: "WARNING" });
  }

  return alerts;
}
