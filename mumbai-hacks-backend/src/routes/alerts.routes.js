import express from "express";
import { getActiveAlerts } from "../controllers/alerts.controller.js";

const router = express.Router();

router.get("/alerts", getActiveAlerts);

export default router;
