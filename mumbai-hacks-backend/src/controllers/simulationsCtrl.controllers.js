import Simulation from "../models/Simulation.models.js";

export const listSimulations = async (req, res, next) => {
  try {
    const docs = await Simulation.find().limit(100).lean();
    res.json({ requestId: req.id, data: docs });
  } catch (err) {
    next(err);
  }
};

export const createSimulation = async (req, res, next) => {
  try {
    const doc = await Simulation.create(req.body);
    res.status(201).json({ requestId: req.id, data: doc });
  } catch (err) {
    next(err);
  }
};
