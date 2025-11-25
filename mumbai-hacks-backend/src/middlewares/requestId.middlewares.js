import { v4 as uuidv4 } from "uuid";

export default function (req, res, next) {
  req.id = uuidv4();
  next();
}
