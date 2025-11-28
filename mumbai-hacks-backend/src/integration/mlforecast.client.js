import axios from "axios";

const ML_API_URL = process.env.ML_API_URL; // e.g. https://hospital-forecast-api.onrender.com
const ML_MODE = process.env.ML_MODE || "ensemble";

/**
 * Build a minimal ML payload from your hospital doc.
 * You SHOULD replace placeholders with real data (AQI, weather, etc.)
 */
function buildMLPayload(hospital) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    date: today,
    admissions: hospital.baselinePatients ?? 150,
    aqi: 180, // TODO: plug real AQI
    temp: 28.5, // TODO: real weather
    humidity: 65,
    rainfall: 0,
    wind_speed: 5,
    mobility_index: 70,
    outbreak_index: 20,
    festival_flag: 0,
    holiday_flag: 0,
    weekday: new Date().getDay(),
    is_weekend: [0, 6].includes(new Date().getDay()) ? 1 : 0,
    population_density: 12000,
    hospital_beds: hospital.resources?.beds || 500,
    staff_count: 200,
    city_id: 1,
    hospital_id_enc: 101,
  };
}

/**
 * Call Python ML API to get quantiles for ONE hospital.
 */
export async function getMLPredictionForHospital(hospital) {
  if (!ML_API_URL) {
    throw new Error("ML_API_URL not configured");
  }

  const payload = buildMLPayload(hospital);

  const res = await axios.post(`${ML_API_URL}/predict`, {
    data: [payload],
    mode: ML_MODE,
  });

  const p = res.data?.predictions?.[0];
  if (!p) {
    throw new Error("Invalid ML prediction response");
  }

  return {
    lower: p.lower,
    median: p.median,
    upper: p.upper,
  };
}
