import dotenv from "dotenv";
dotenv.config(); // MUST be first

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startMLKeepAlive } from "./utils/mlKeepAlive.js";

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // ✅ START ML KEEP-ALIVE
  startMLKeepAlive();

  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})();
