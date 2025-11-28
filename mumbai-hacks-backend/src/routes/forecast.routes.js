import express from "express";
import {
  forecastAll,
  forecastOne,
} from "../controllers/forecast.controller.js";

const router = express.Router();

router.get("/forecast", forecastAll);
router.get("/forecast/:id", forecastOne);

export default router;
