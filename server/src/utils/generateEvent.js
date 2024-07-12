export const generate_event_of_a_ball = (extras, runs, wicket) => {
  let event = "0";
  if (extras) {
    if (wicket) {
      event = `wicket`;
    } else {
      if (runs === 4) {
        event = "four";
      } else if (runs === 6) {
        event = "six";
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
      event = "0";
    }
  }

  return event;
};

export const generateDismissalText = (wicket, fielder, bowler) => {
  let dismissalText = "";

  console.log(wicket, "wicket", fielder, "fielder", bowler, "bowler");
  switch (wicket.type) {
    case "caught":
      if (fielder._id.toString() === bowler._id.toString()) {
        dismissalText = `c & b ${bowler.player.name}`;
      } else {
        dismissalText = `c ${fielder.name} b ${bowler.player.name}`;
      }
      break;
    case "bowled":
      dismissalText = `b ${bowler.player.name}`;
      break;
    case "lbw":
      dismissalText = `lbw b ${bowler.player.name}`;
      break;
    case "stumped":
      dismissalText = `st ${fielder.name} b ${bowler.player.name}`;
      break;
    case "run out":
      dismissalText = `run out (${fielder.name})`;
      break;
    case "hit wicket":
      dismissalText = `hit wicket b ${bowler.player.name}`;
      break;
    case "retired hurt":
      dismissalText = `retired hurt`;
      break;
    default:
      dismissalText = `unknown dismissal`;
      break;
  }

  return dismissalText;
};
