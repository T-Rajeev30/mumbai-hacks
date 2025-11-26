import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname issue in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cities = [
  { city: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777 },
  { city: "Delhi", state: "Delhi", lat: 28.7041, lon: 77.1025 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { city: "Hyderabad", state: "Telangana", lat: 17.385, lon: 78.4867 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
];

const departmentsList = [
  "Emergency",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "ICU",
  "General Medicine",
  "Pediatrics",
  "Oncology",
  "Surgery",
];

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function generateHospital(i) {
  const city = cities[randomRange(0, cities.length - 1)];
  const baseline = randomRange(50, 500);

  const departments = Array.from({ length: randomRange(5, 10) }, () => {
    const name = departmentsList[randomRange(0, departmentsList.length - 1)];
    return {
      name,
      capacity: randomRange(20, 200),
      doctors: randomRange(5, 30),
      nurses: randomRange(10, 60),
    };
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const pastWeekData = days.map((day) => ({
    day,
    patients: Math.round(baseline * randomFloat(0.85, 1.15)),
    surgeries: randomRange(5, 50),
    emergencies: randomRange(10, 100),
  }));

  return {
    id: `HOSP-${String(i).padStart(4, "0")}`,
    location: {
      lat: city.lat,
      lon: city.lon,
      city: city.city,
      state: city.state,
    },
    baselinePatients: baseline,
    departments,
    resources: {
      beds: randomRange(100, 1000),
      ventilators: randomRange(5, 50),
      oxygen: randomRange(500, 5000),
      ambulances: randomRange(1, 15),
    },
    pastWeekData,
    pollutionSensitivity: randomFloat(0, 1),
    festivalSensitivity: randomFloat(0, 1),
    weatherSensitivity: randomFloat(0, 1),
  };
}

function generateHospitals(N) {
  return Array.from({ length: N }, (_, i) => generateHospital(i + 1));
}

function main() {
  const devData = generateHospitals(100);
  const prodData = generateHospitals(1000);

  const outputDir = path.join(__dirname, "../data/hospitals");
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "dev.json"),
    JSON.stringify(devData, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "prod.json"),
    JSON.stringify(prodData, null, 2)
  );

  console.log(
    "Generated dev.json (100 hospitals) and prod.json (1000 hospitals)"
  );
}

main();
