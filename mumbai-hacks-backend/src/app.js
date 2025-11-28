import express from "express";
import cors from "cors";

import logger from "./middlewares/logger.middlewares.js";
import requestId from "./middlewares/requestId.middlewares.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";

import hospitals from "./routes/hospitals.routes.js";
import simulationRoutes from "./routes/simulation.routes.js";
import eventRoutes from "./routes/event.routes.js";
import aggregationRoutes from "./routes/aggregation.routes.js";
import alertRoutes from "../src/routes/alerts.routes.js";
import forecastRoutes from "./routes/forecastMl.routes.js";
import simulationMlRoutes from "./routes/simulationMl.routes.js";
import forecastMlRoutes from "./routes/forecastMl.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(requestId);
app.use(logger);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/hospitals", hospitals);
app.use("/api", aggregationRoutes);
app.use("/api", simulationRoutes);
app.use("/api", eventRoutes);
app.use("/api", alertRoutes);
app.use("/api", forecastRoutes);
app.use("/api", simulationMlRoutes);
app.use("/api", forecastMlRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

app.use(errorHandler);

console.log(
  app._router?.stack
    ?.filter((r) => r.route)
    .map((r) => ({
      path: r.route.path,
      methods: r.route.methods,
    }))
);

export default app;
