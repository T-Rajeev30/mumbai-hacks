import {
  getEventState,
  updateEventState,
} from "../simulation/eventState.simulation.js";

export function getEvents(req, res) {
  return res.status(200).json(getEventState());
}

export function updateEvents(req, res) {
  const { pollution, festival, weather } = req.body;

  updateEventState({ pollution, festival, weather });

  return res.status(200).json({
    message: "Event intensities updated",
    state: getEventState(),
  });
}
