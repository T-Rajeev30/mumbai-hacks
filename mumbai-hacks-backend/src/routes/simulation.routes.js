import express from "express";
import {
  simulateAll,
  simulateOne,
} from "../controllers/simulationsCtrl.controllers.js";
import { simulateOneWithML } from "../controllers/simulationsMl.controller.js";

const router = express.Router();

router.get("/simulate", simulateAll);
router.get("/simulate-ml/:id", simulateOneWithML);
router.get("/simulate/:id", simulateOne);

export default router;
