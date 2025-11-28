import express from "express";
import {
  simulateAll,
  simulateOne,
} from "../controllers/simulationsCtrl.controllers.js";

const router = express.Router();

router.get("/simulate", simulateAll);

// MUST BE LAST
router.get("/simulate/:id", simulateOne);

export default router;
