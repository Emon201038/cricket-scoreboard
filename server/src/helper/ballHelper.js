import { Ball } from "../models/balls-model.js";
import { Batsman } from "../models/batsman-model.js";
import { Bowler } from "../models/bowler-model.js";
import { Innings } from "../models/innings-model.js";
import { Over } from "../models/over-model.js";
import { Player } from "../models/player-model.js";
import { generateDismissalText } from "../utils/generateEvent.js";

export const updateBatsmanStat = async (
  updatedLegalBalls,
  playingBatsman = [],
  ball = {},
  extras,
  runs,
  session
) => {
  let striker = playingBatsman.find((b) => b.isStriker);
  let non_striker = playingBatsman.find((b) => !b.isStriker);
  if (runs % 2 === 1) {
    if (!extras) {
      if (striker) {
        striker.runs += runs;
        striker.ballsFaced += 1;
      }
    }
    if (extras?.type === "byes" || extras?.type === "leg-byes") {
      if (striker) {
        striker.ballsFaced += 1;
      }
    }
    if (updatedLegalBalls < 6) {
      if (striker) {
        striker.isStriker = !striker?.isStriker;
      }
      if (non_striker) {
        non_striker.isStriker = !non_striker?.isStriker;
      }
    }

    await striker?.save({ session });
    await non_striker?.save({ session });
  } else {
    if (!extras) {
      if (striker) {
        striker.runs += runs;
        if (runs === 4) {
          striker["4s"] += 1;
        }
        if (runs === 6) {
          striker["6s"] += 1;
        }
        striker.ballsFaced += 1;
      }
    }
    if (extras?.type === "byes" || extras?.type === "leg-byes") {
      if (striker) {
        striker.ballsFaced += 1;
      }
    }

    // over.runs += runs;
    await striker.save({ session });
    await non_striker.save({ session });
    // await over.save();
  }
};

export const handleBatsmanOut = async (
  ball = {},
  playingBatsman = [],
  bowler,
  runsOutBatsmanId,
  updatedOver = {},
  session
) => {
  const createdBall = await ball.populate([
    {
      path: "wicket.fielder",
      select: "name",
    },
    {
      path: "bowler",
      select: "player",
      populate: {
        path: "player",
        select: "name",
      },
    },
  ]);

  console.log(createdBall);
  const wicket = ball?.wicket || null;
  if (wicket) {
    const innings = await Innings.findById(updatedOver.inningsId).session(
      session
    );
    if (wicket.type === "run out") {
      const outBatsman = await Batsman.findById(wicket.outBatsman).session(
        session
      );
      if (outBatsman.isStriker) {
        outBatsman.isStriker = false;
      }
      outBatsman.status = "out";
      outBatsman.out = {
        type: "run out",
        fielder: createdBall.wicket.fielder._id,
        dismissalText: `run out (${createdBall.wicket?.fielder?.name})`,
      };
      await outPlayer.save({ session });

      innings.fallsOfWicket.push({
        batsman: outBatsman._id,
        fielder: createdBall.wicket.fielder._id,
        bowler: updatedOver.bowler,
        over: innings.balls,
        run: innings.runs,
      });
      innings.wickets += 1;

      const outPlayer = await Player.findById(outBatsman.player).session(
        session
      );
      outPlayer.battingStats = {
        matches: outPlayer.battingStats.matches + 1,
        runs: outPlayer.battingStats.runs + outBatsman.runs,
        halfCenturies:
          outPlayer.battingStats.halfCenturies +
          (outBatsman.runs >= 50 && outBatsman.runs < 100)
            ? 1
            : 0,
        centuries:
          outPlayer.battingStats.halfCenturies + (outBatsman.runs >= 100)
            ? 1
            : 0,
        strikeRate:
          (outPlayer.battingStats.strikeRate +
            (outBatsman.runs / outBatsman.ballsFaced) * 100) /
          (outPlayer.battingStats.strikeRate > 0)
            ? 2
            : 1,
        average:
          (outPlayer.battingStats.runs + outBatsman.runs) /
          (outPlayer.battingStats.matches + 1),
      };
      await outBatsman.save({ session });
    } else {
      const outBatsman = await Batsman.findById(wicket.outBatsman).session(
        session
      );

      outBatsman.isStriker = false;
      outBatsman.status = "out";
      outBatsman.out = {
        type: wicket.type,
        fielder: createdBall.wicket.fielder._id,
        dismissalText: generateDismissalText(
          wicket,
          createdBall.wicket.fielder,
          createdBall.bowler
        ),
      };
      await outBatsman.save({ session });

      innings.fallsOfWicket.push({
        batsman: outBatsman._id,
        fielder: createdBall.wicket.fielder._id,
        bowler: updatedOver.bowler,
        over: innings.balls,
        run: innings.runs,
      });

      const outPlayer = await Player.findById(outBatsman.player).session(
        session
      );
      outPlayer.battingStats = {
        matches: outPlayer.battingStats.matches + 1,
        runs: outPlayer.battingStats.runs + outBatsman.runs,
        halfCenturies:
          outPlayer.battingStats.halfCenturies +
          (outBatsman.runs >= 50 && outBatsman.runs < 100)
            ? 1
            : 0,
        centuries:
          outPlayer.battingStats.halfCenturies + (outBatsman.runs >= 100)
            ? 1
            : 0,
        strikeRate:
          (outPlayer.battingStats.strikeRate +
            (outBatsman.runs / outBatsman.ballsFaced) * 100) /
          (outPlayer.battingStats.strikeRate > 0)
            ? 2
            : 1,
        average:
          (outPlayer.battingStats.runs + outBatsman.runs) /
          (outPlayer.battingStats.matches + 1),
      };
      await outPlayer.save({ session });
    }

    updatedOver.wicket += 1;
    innings.wickets += 1;
    await innings.save({ session });
    await updatedOver.save({ session });
  }
};

export const updateBowlerStat = async (
  ball = {},
  over = [],
  extras,
  session
) => {
  const bowler = await Bowler.findById(ball.bowler._id).session(session);
  const player = await Player.findById(bowler.player._id).session(session);
  if (extras) {
    if (extras.type === "wide" || extras.type === "no-ball") {
      bowler.runsConceded += ball.runs + 1;
    } else {
      // bowler.runsConceded += extras?.runs;
    }
  } else {
    bowler.runsConceded += ball.runs;
    bowler.overBowled += 1;

    const legalBalls = over.balls.filter((item) => {
      return (
        item.extras === null ||
        (item.extras.type !== "wide" && item.extras.type !== "no-ball")
      );
    }).length;

    if (legalBalls === 6) {
      for (const ball in over) {
        if (!ball.extras && ball.runs === 0) {
          bowler.maidens += 1;
        }
      }
    }

    if (ball.wicket !== null) {
      if (ball?.wicket?.type !== "run out") {
        bowler.wicketTaken += 1;
        player.bowlingStats.wickets += 1;
        if (bowler.wicketTaken === 2) {
          player["3-wicket-haul"] += 1;
        }
        if (bowler.wicketTaken === 4) {
          player.bowlingStats["3-wicket-haul"] -= 1;
          player.bowlingStats["5-wicket-haul"] += 1;
        }
      }
    }
  }

  await bowler.save({ session });
  await player.save({ session });
};

// export class MatchManager {
//   constructor(session) {
//     this.session = session;
//   }

//   async handleRuns(batsmanId, runs, ballNumber, isLegalBall) {
//     const batsman = await Batsman.findById(batsmanId).session(this.session);
//     batsman.runs += runs;
//     if (isLegalBall) {
//       batsman.ballsFaced += 1;
//     }
//     if (runs === 4) {
//       batsman["4s"] += 1;
//     }
//     if (runs === 6) {
//       batsman["6s"] += 1;
//     }
//     await batsman.save({ session: this.session });

//     const playerBatsman = await Player.findById(batsman.player).session(
//       this.session
//     );
//     playerBatsman.battingStats.runs += runs;
//     if (isLegalBall) {
//       playerBatsman.ballsFaced += 1;
//     }
//     if (batsman.runs >= 50 && batsman.runs < 100) {
//       playerBatsman.battingStats.halfCenturies += 1;
//     }
//     if (batsman.runs >= 100) {
//       playerBatsman.battingStats.centuries += 1;
//     }

//     await playerBatsman.save({ session: this.session });

//     if (ballNumber !== 6) {
//       if (runs % 2 !== 0) {
//         return true; // Rotate strike
//       }
//     } else {
//       if (runs % 2 === 0) {
//         return true; // Rotate strike
//       }
//     }
//     return false;
//   }

//   async handleWicket(wicket, bowlerId, ballNumber, isLegalBall) {
//     const outBatsman = await Batsman.findById(wicket.outBatsman).session(
//       this.session
//     );
//     if (isLegalBall) {
//       outBatsman.ballsFaced += 1;
//     }
//     if (wicket.strikerOut) {
//       outBatsman.isStriker = false;
//     }
//     outBatsman.save({ session: this.session });

//     const bowler = await Bowler.findById(bowlerId).session(this.session);
//     if (wicket.type !== "run out") {
//       bowler.wicketTaken += 1;
//     }
//     bowler.save({ session: this.session });

//     const playerBowler = await Player.findById(bowler.player).session(
//       this.session
//     );
//     if (wicket.type !== "run out") {
//       playerBowler.bowlingStats.wickets += 1;
//       if (bowler.wicketTaken === 3) {
//         playerBowler.bowlingStats["3-wicket-haul"] += 1;
//       }
//       if (bowler.wicketTaken === 5) {
//         playerBowler.bowlingStats["5-wicket-haul"] += 1;
//       }
//     }
//     await playerBowler.save({ session: this.session });

//     const fielder = await Player.findById(wicket.fielder).session(this.session);
//     if (wicket.type === "caught" || wicket.type === "runOut") {
//       fielder.fieldingStats[`${wicket.type}`] += 1;
//     }
//     await fielder.save({ session: this.session });

//     if (ballNumber === 6) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   async handleExtras(extras, runs) {
//     if (extras.type === "wide" || extras.type === "no-ball") {
//       return { runsToAdd: 1 + runs + extras.runs, ballsToAdd: 0 };
//     } else {
//       return { runsToAdd: runs + extras.runs, ballsToAdd: 1 };
//     }
//   }

//   async updateOver(overId, ballId) {
//     const over = await Over.findById(overId)
//       .populate({
//         path: "balls",
//         model: Ball,
//         select: "extras",
//       })
//       .session(this.session);
//     over.balls.push(ballId);
//     await over.save({ session: this.session });
//     return over;
//   }

//   async updateInnings(inningsId, runs = 0, ball = 0, wicket = 0) {
//     const innings = await Innings.findById(inningsId).session(this.session);
//     innings.runs += runs;
//     innings.balls += ball;
//     innings.wickets += wicket;
//     await innings.save({ session: this.session });
//     return innings;
//   }

//   async rotateStrikers(innings) {
//     const batsman = await Batsman.find({
//       inningsId: innings._id,
//       status: "not out",
//     }).session(this.session);
//     const striker = batsman.find((b) => b.isStriker);
//     const nonStriker = batsman.find((b) => !b.isStriker);

//     striker.isStriker = !striker.isStriker;
//     non.isStriker = !non.isStriker;
//     await striker.save({ session: this.session });
//     await nonStriker.save({ session: this.session });
//   }
// }
