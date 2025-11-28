import axios from "axios";

const ML_MODE = process.env.ML_MODE || "ensemble";

function buildMLPayload(hospital) {
  const today = new Date().toISOString().slice(0, 10);
  const day = new Date().getDay();

  return {
    date: today,
    admissions: hospital.baselinePatients ?? 150,
    aqi: 180,
    temp: 28.5,
    humidity: 65,
    rainfall: 0,
    wind_speed: 5,
    mobility_index: 70,
    outbreak_index: 20,
    festival_flag: 0,
    holiday_flag: 0,
    weekday: day,
    is_weekend: [0, 6].includes(day) ? 1 : 0,
    population_density: 12000,
    hospital_beds: hospital.resources?.beds || 500,
    staff_count: 200,
    city_id: 1,
    hospital_id_enc: 101,
  };
}

async function callML(payload) {
  const ML_API_URL = process.env.ML_API_URL;
  if (!ML_API_URL) throw new Error("ML_API_URL not configured");

  try {
    return await axios.post(
      `${ML_API_URL}/predict`,
      { data: [payload], mode: ML_MODE },
      { timeout: 20000 }
    );
  } catch (err) {
    if (err.response && [502, 504].includes(err.response.status)) {
      console.warn("ML cold start detected, retrying...");
      return await axios.post(
        `${ML_API_URL}/predict`,
        { data: [payload], mode: ML_MODE },
        { timeout: 20000 }
      );
    }
    throw err;
  }
}

export async function getMLPredictionForHospital(hospital) {
  const payload = buildMLPayload(hospital);
  const res = await callML(payload);

  const p = res.data?.predictions?.[0];
  if (!p) throw new Error("Invalid ML prediction response");

  return {
    lower: p.lower,
    median: p.median,
    upper: p.upper,
  };
}
