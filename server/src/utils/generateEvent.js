export const generate_event_of_a_ball = (extras) => {
  let event = "dot";
  if (extras) {
    if (wicket) {
      if (runs > 0) {
        event = `${runs} + ${extras.type} + wicket`;
      } else {
        event = `${extras.type} + wicket`;
      }
    } else {
      if (runs === 4) {
        event = "4 + " + extras.type;
      } else if (runs === 6) {
        event = "6 + " + extras.type;
      } else if (runs > 0) {
        event = `${runs} + ${extras.type}`;
      } else {
        event = extras.type;
      }
    }
  } else {
    if (runs === 4) {
      event = "4";
    } else if (runs === 6) {
      event = "6";
    } else if (runs > 0) {
      event = runs;
    } else {
      event = "dot";
    }
  }

  return event;
};
