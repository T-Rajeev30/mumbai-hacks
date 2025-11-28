// Global event intensity state used in simulation
// Values between 0 and 1

let eventState = {
  pollution: 0.3,
  festival: 0.4,
  weather: 0.25,
};

export function getEventState() {
  return eventState;
}

export function updateEventState(newState) {
  eventState = {
    ...eventState,
    ...newState,
  };
}
