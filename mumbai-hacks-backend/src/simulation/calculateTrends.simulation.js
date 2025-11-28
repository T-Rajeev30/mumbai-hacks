// Calculates trends from pastWeekData (7 days)

export function calculateTrends(pastWeekData) {
  if (!pastWeekData || pastWeekData.length === 0) {
    return { trendFactor: 0, movingAvg: 0 };
  }

  const patientsArr = pastWeekData.map((d) => d.patients);

  // Moving average of last 7 days
  const movingAvg = patientsArr.reduce((a, b) => a + b, 0) / patientsArr.length;

  // Simple slope calculation (trend)
  let slope = 0;
  for (let i = 1; i < patientsArr.length; i++) {
    slope += patientsArr[i] - patientsArr[i - 1];
  }

  // Normalize slope
  const trendFactor = Math.max(-0.3, Math.min(0.5, slope / 100));

  return {
    trendFactor,
    movingAvg,
  };
}
