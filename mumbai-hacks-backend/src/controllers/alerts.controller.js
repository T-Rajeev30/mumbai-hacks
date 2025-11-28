import { aggregateSimulations } from "../simulation/aggregate.simulation.js";

// System-wide alert summary
export async function getActiveAlerts(req, res) {
  try {
    const data = await aggregateSimulations({ by: "all" });

    const criticalCities = [];

    if (data.cities && Array.isArray(data.cities)) {
      data.cities.forEach((city) => {
        if (city.summary.alerts.CRITICAL > 0) {
          criticalCities.push({
            city: city.city,
            critical: city.summary.alerts.CRITICAL,
            warning: city.summary.alerts.WARNING,
          });
        }
      });
    }

    return res.status(200).json({
      timestamp: new Date(),
      overall: data.overall.alerts,
      criticalCities,
    });
  } catch (err) {
    console.error("Alert aggregation failed:", err);
    return res.status(500).json({
      error: "Failed to compute alerts",
    });
  }
}
