import express from "express";
import {
  getAggregation,
  getAggregationByCity,
  getAggregationByState,
} from "../controllers/aggregation.controller.js";

const router = express.Router();

// GLOBAL aggregation
router.get("/simulate/aggregate", getAggregation);

// City-level aggregation
router.get("/simulate/aggregate/city/:city", getAggregationByCity);

// State-level aggregation
router.get("/simulate/aggregate/state/:state", getAggregationByState);

export default router;
