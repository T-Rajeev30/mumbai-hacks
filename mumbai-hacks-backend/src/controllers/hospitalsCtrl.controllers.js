import Hospital from "../models/Hospital.models.js";

export const listHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find().limit(200).lean();
    res.json({ requestId: req.id, data: hospitals });
  } catch (err) {
    next(err);
  }
};

export const createHospital = async (req, res, next) => {
  try {
    const doc = await Hospital.create(req.body);
    res.status(201).json({ requestId: req.id, data: doc });
  } catch (err) {
    next(err);
  }
};

export const getHospital = async (req, res, next) => {
  try {
    const doc = await Hospital.findById(req.params.id).lean();
    if (!doc)
      return res.status(404).json({ requestId: req.id, message: "Not found" });
    res.json({ requestId: req.id, data: doc });
  } catch (err) {
    next(err);
  }
};
