import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI missing in .env");
    process.exit(1);
  }
  await connectDB(MONGO_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
