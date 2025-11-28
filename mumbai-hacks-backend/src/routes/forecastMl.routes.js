import express from "express";
import { forecastOneWithML } from "../controllers/forecastMl.controller.js";

const router = express.Router();

// GET /api/forecast-ml/:id?days=7
router.get("/forecast-ml/:id", forecastOneWithML);

export default router;
