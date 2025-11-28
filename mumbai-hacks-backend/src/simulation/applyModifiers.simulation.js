import { getEventState } from "./eventState.simulation.js";

export function applyModifiers(baseLoad, hospital) {
  const { pollutionSensitivity, festivalSensitivity, weatherSensitivity } =
    hospital;

  const { pollution, festival, weather } = getEventState();

  const pollutionBoost = 1 + pollutionSensitivity * pollution;
  const festivalBoost = 1 + festivalSensitivity * festival;
  const weatherBoost = 1 + weatherSensitivity * weather;

  return baseLoad * pollutionBoost * festivalBoost * weatherBoost;
}
