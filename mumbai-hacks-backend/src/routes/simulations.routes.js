import express from "express";
import {
  listSimulations,
  createSimulation,
} from "../controllers/simulationsCtrl.controllers.js";
const router = express.Router();

router.get("/", listSimulations);
router.post("/", createSimulation);

export default router;
