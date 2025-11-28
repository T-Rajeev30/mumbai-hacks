import { THRESHOLDS } from "./thresholds.js";

/**
 * input = {
 *   bedUtilization: number,
 *   ventilatorUtilization: number,
 *   riskScore: number,
 *   beds?: number,
 *   ventilators?: number,
 *   mlUpper?: number | null  // absolute patients at q90 (optional)
 * }
 */
export function evaluateAlerts(input) {
  const alerts = [];

  const bed = Number(input.bedUtilization || 0);
  const vent = Number(input.ventilatorUtilization || 0);
  const risk = Number(input.riskScore || 0);

  // 1) Deterministic alerts from current simulated or ML-median load
  if (bed >= THRESHOLDS.bedUtilization.critical) {
    alerts.push({ type: "BED_CAPACITY", level: "CRITICAL", source: "current" });
  } else if (bed >= THRESHOLDS.bedUtilization.warning) {
    alerts.push({ type: "BED_CAPACITY", level: "WARNING", source: "current" });
  }

  if (vent >= THRESHOLDS.ventilatorUtilization.critical) {
    alerts.push({
      type: "VENTILATOR_CAPACITY",
      level: "CRITICAL",
      source: "current",
    });
  } else if (vent >= THRESHOLDS.ventilatorUtilization.warning) {
    alerts.push({
      type: "VENTILATOR_CAPACITY",
      level: "WARNING",
      source: "current",
    });
  }

  if (risk >= THRESHOLDS.riskScore.critical) {
    alerts.push({
      type: "OVERALL_SURGE",
      level: "CRITICAL",
      source: "current",
    });
  } else if (risk >= THRESHOLDS.riskScore.warning) {
    alerts.push({ type: "OVERALL_SURGE", level: "WARNING", source: "current" });
  }

  // 2) ML-based worst-case alerts (using q90 upper bound)
  if (input.mlUpper && input.beds) {
    const mlUpperBedUtil = input.mlUpper / input.beds;

    if (mlUpperBedUtil >= THRESHOLDS.bedUtilization.critical) {
      alerts.push({
        type: "BED_CAPACITY",
        level: "CRITICAL",
        source: "ml_upper", // "if worst case happens, it's critical"
      });
    } else if (mlUpperBedUtil >= THRESHOLDS.bedUtilization.warning) {
      alerts.push({
        type: "BED_CAPACITY",
        level: "WARNING",
        source: "ml_upper",
      });
    }
  }

  return alerts;
}
