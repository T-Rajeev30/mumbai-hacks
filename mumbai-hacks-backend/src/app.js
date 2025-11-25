import express from "express";
import cors from "cors";
import logger from "./middlewares/logger.middlewares.js";
import requestId from "./middlewares/requestId.middlewares.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";
import hospitals from "./routes/hospitals.routes.js";
import simulations from "./routes/simulations.routes.js";

const app = express();

app.use(cors()); // allow cross-origin requests from frontend
app.use(express.json({ limit: "1mb" })); // parse JSON body
app.use(requestId); // attach unique request id to req
app.use(logger); // log request

// health check
app.get("/health", (req, res) => res.json({ ok: true, requestId: req.id }));

// api
app.use("/api/hospitals", hospitals);
app.use("/api/simulations", simulations);

// fallback for unknown routes
app.use((req, res) =>
  res.status(404).json({ requestId: req.id, message: "Not found" })
);

// error handler (last)
app.use(errorHandler);

export default app;
