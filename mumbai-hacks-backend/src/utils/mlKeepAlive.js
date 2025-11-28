import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export function startMLKeepAlive() {
  const ML_API_URL = process.env.ML_API_URL;

  if (!ML_API_URL) {
    console.warn("ML keep-alive disabled (ML_API_URL not set)");
    return;
  }

  const PING_INTERVAL_MS = 1 * 60 * 1000; // 1 minutes

  setInterval(async () => {
    try {
      await axios.get(`${ML_API_URL}/health`, {
        timeout: 5000,
      });
      console.log("[ML KEEP-ALIVE] ping ok");
    } catch (err) {
      console.warn("[ML KEEP-ALIVE] ping failed (ignored)");
    }
  }, PING_INTERVAL_MS);

  console.log("[ML KEEP-ALIVE] started");
}
