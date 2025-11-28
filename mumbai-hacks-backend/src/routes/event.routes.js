import express from "express";
import { getEvents, updateEvents } from "../controllers/event.controllers.js";

const router = express.Router();

// Get current event intensities
router.get("/events", getEvents);

// Update event intensities
router.post("/events", updateEvents);

export default router;
