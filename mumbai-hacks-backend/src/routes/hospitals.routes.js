import express from "express";
import {
  listHospitals,
  createHospital,
  getHospital,
} from "../controllers/hospitalsCtrl.controllers.js";
const router = express.Router();

router.get("/", listHospitals);
router.post("/", createHospital);
router.get("/:id", getHospital);

export default router;
