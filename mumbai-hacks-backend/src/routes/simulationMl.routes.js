import express from "express";
import { simulateOneWithML } from "../controllers/simulationsMl.controller.js";

const router = express.Router();

// e.g. GET /api/simulate-ml/HOSP-0001
router.get("/simulate-ml/:id", simulateOneWithML);

export default router;
