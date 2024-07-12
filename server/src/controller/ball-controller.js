import createError from "http-errors";

import { Ball } from "../models/balls-model.js";
import { Over } from "../models/over-model.js";
import { successResponse } from "./response-controller.js";
import { Player } from "../models/player-model.js";
import { Innings } from "../models/innings-model.js";
import { Batsman } from "../models/batsman-model.js";
import { generate_event_of_a_ball } from "../utils/generateEvent.js";
import { Bowler } from "../models/bowler-model.js";
import { Match } from "../models/match-model.js";
import mongoose from "mongoose";
import {
  handleBatsmanOut,
  // MatchManager,
  updateBatsmanStat,
  updateBowlerStat,
} from "../helper/ballHelper.js";

export const handleGetAllBallsOfAnOver = async (req, res, next) => {
  try {
    const overId = req.params.overId;
    const balls = await Ball.find({ overId });
    return successResponse(res, {
      message: "Balls are fetched successfull.",
      statusCode: 200,
      payload: balls,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetSingleBall = async (req, res, next) => {
  try {
    const ballId = req.params.ballId;

    const ball = await Ball.findById(ballId);
    if (!ball) {
      throw createError(404, "No ball found");
    }
    return successResponse(res, {
      message: "ball is found successfull.",
      statusCode: 200,
      payload: ball,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateBall = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const overId = req.params.overId;
    const {
      bowlerId,
      batsmanId,
      extras = null,
      wicket = null,
      runs = 0,
      runsOutBatsmanId,
    } = req.body || {};

    //checking over existence
    const over = await Over.findById(overId)
      .populate({
        path: "balls",
        model: Ball,
        select: "extras",
      })
      .session(session);
    if (!over) {
      throw createError(404, "No over found");
    }

    const strikers = await Batsman.find({
      inningsId: over.inningsId,
      status: "not out",
    });
    if (strikers.length < 2) {
      throw createError(400, "Please add one more batsman to create a ball");
    }

    const match = await Match.findOne({
      Innings: { $in: [new mongoose.Types.ObjectId(over.inningsId)] },
    }).session(session);

    const battingTeam =
      match.toss.decision === "bat"
        ? match.teams.find(
            (t) => t.team.toString() === match.toss.winner.toString()
          )
        : match.teams.find(
            (t) => t.team.toString() !== match.toss.winner.toString()
          );
    const bowlingTeam =
      match.toss.decision === "bowl"
        ? match.teams.find(
            (t) => t.team.toString() === match.toss.winner.toString()
          )
        : match.teams.find(
            (t) => t.team.toString() !== match.toss.winner.toString()
          );

    //checking over previous balls
    let legalBallsCount = over.balls.filter((item) => {
      return (
        item.extras === null ||
        (item.extras.type !== "wide" && item.extras.type !== "no-ball")
      );
    }).length;
    if (legalBallsCount >= 6) {
      throw createError(400, "This over has finished. create a new over");
    }

    //checking player existence
    const bowler = await Bowler.findById(bowlerId)
      .populate("player", "name")
      .session(session);
    if (!bowler) {
      throw createError(404, "Bowler is not found");
    }
    const batsman = await Batsman.findOne({
      _id: batsmanId,
      status: "not out",
      isStriker: true,
    })
      .populate({
        path: "inningsId",
        model: Innings,
        select: "matchId",
      })
      .session(session);
    if (!batsman) {
      throw createError(404, "Batsman is not found");
    }
    if (batsman.status !== "not out" || !batsman.isStriker) {
      throw createError(
        400,
        "batsman is out or not striker. Try another who is currently striker"
      );
    }

    const isBowlerPlaying = bowlingTeam.playingXi.some(
      (p) => p.toString() === bowler.player._id.toString()
    );
    if (!isBowlerPlaying) {
      throw createError(404, "Bowler is not playing in the bowling team");
    }

    const isBatsmanPlaying = battingTeam.playingXi.some(
      (p) => p.toString() === batsman.player.toString()
    );
    if (!isBatsmanPlaying) {
      throw createError(404, "Batsman is not playing in the batting team");
    }

    //create ball
    const createdBall = new Ball({
      batsman: batsmanId,
      bowler: bowlerId,
      runs,
      wicket,
      extras,
      overId,
    });

    (await createdBall.save({ session })).populate("bowler", "name");

    const ball = await Ball.findById(createdBall._id)
      .populate([
        {
          path: "wicket.fielder",
          model: "Player",
          select: "name",
        },
        {
          path: "bowler",
          model: "Bowler",
          select: "player",
          populate: {
            path: "player",
            model: "Player",
            select: "name",
          },
        },
      ])
      .lean()
      .session(session);

    const innings = await Innings.findById(bowler.innings).session(session);
    innings.runs += Number(
      extras?.type === "wide" || extras?.type === " no-ball"
        ? runs + 1 + (extras?.runs || 0)
        : runs + (extras?.runs || 0)
    );
    innings.balls += Number(
      extras ? (extras.type === "wide" || extras.type === "no-ball" ? 0 : 1) : 1
    );
    if (extras) {
      if (extras.type === "byes") {
        innings.extras.byes += extras.runs;
      }
      if (extras.type === "legByes") {
        innings.extras.legByes += extras.runs;
      }
      if (extras.type === "wide") {
        innings.extras.wides += 1;
      }
      if (extras.type === "no-ball") {
        innings.extras.noBalls += 1;
      }

      await innings.save({ session });
    }

    await Innings.findByIdAndUpdate(bowler.innings, {
      $inc: {
        runs:
          extras?.type === "wide" || extras?.type === " no-ball"
            ? runs + 1 + (extras?.runs || 0)
            : runs + (extras?.runs || 0),
        balls: extras
          ? extras.type === "wide" || extras.type === "no-ball"
            ? 0
            : 1
          : 1,
      },
    }).session(session);

    const updatedOver = await Over.findByIdAndUpdate(
      overId,
      {
        $push: { balls: createdBall._id },
        $inc: {
          wicket: wicket ? 1 : 0,
          runs: extras
            ? extras?.type === "wide" || extras?.type === "no-ball"
              ? runs + 1 + (extras?.runs || 0)
              : (extras?.runs || 0) + runs
            : runs,
        },
      },
      { new: true }
    )
      .populate({
        path: "balls",
        model: Ball,
        select: "extras",
      })
      .session(session);

    const playingBatsman = await Batsman.find({ status: "not out" }).session(
      session
    );

    const updatedLegalBalls = updatedOver.balls.filter((item) => {
      return (
        item.extras === null ||
        (item.extras.type !== "wide" && item.extras.type !== "no-ball")
      );
    }).length;

    if (wicket) {
      if (!wicket.type || !wicket.outBatsman) {
        throw createError(
          400,
          "please provide all the necessery data for wicket."
        );
      }

      if (wicket.type !== "bowled" || wicket.type !== "lbw") {
        if (!wicket.fielder) {
          throw createError(
            400,
            `fielder is required for ${wicket.type} wicket.`
          );
        }
      }

      await handleBatsmanOut(
        createdBall,
        playingBatsman,
        bowler,
        runsOutBatsmanId,
        updatedOver,
        session
      );
    }
    await updateBatsmanStat(
      updatedLegalBalls,
      playingBatsman,
      ball,
      extras,
      runs,
      session
    );

    await updateBowlerStat(ball, updatedOver, extras, session);

    await session.commitTransaction();
    session.endSession();
    return successResponse(res, {
      message: "Ball is created successfull.",
      statusCode: 201,
      payload: createdBall,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(error);
  }
};

export const handleEditBall = async (req, res, next) => {
  try {
    return successResponse(res, {
      message: "Ball is updated successfull.",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const handleChangeStrike = async (req, res, next) => {
  try {
    const batsman = await Batsman.find({ status: "not out" });
    if (batsman.length < 2) {
      throw createError(400, "Please add 1 more batsman to shuffle strike");
    }

    const striker = batsman.find((b) => b.isStriker);
    const nonStriker = batsman.find((b) => !b.isStriker);

    striker.isStriker = !striker.isStriker;
    nonStriker.isStriker = !nonStriker.isStriker;

    await striker.save();
    await nonStriker.save();

    return successResponse(res, {
      message: "Strike rotate successfull",
      payload: { striker, nonStriker },
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateInningsScore = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;

    const { runs, extras, wicket } = req.body;
    const innings = await Innings.findById(inningsId);
    if (!innings) {
      throw createError(404, "No innings found");
    }

    innings.runs += runs;
    if (extras) {
      if (extras.type === "wide") {
        innings.extras.wides += 1;
      } else if (extras.type === "no-ball") {
        innings.extras.noBalls += 1;
      } else if (extras.type === "byes") {
        innings.extras.byes += extras.runs;
      } else if (extras.type === "leg-byes") {
        innings.extras.legByes += extras.runs;
      }
    }

    if (wicket) {
      innings.wickets += 1;
    }
  } catch (error) {
    next(error);
  }
};

export const handleUpdateBatsmanAndBowlerScore = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    const {
      overId,
      batsmanId,
      bowlerId,
      runs,
      wicket,
      extras,
      runsOutBatsmanId,
    } = req.body;

    const over = await Over.findById(overId);
    const batsman = await Batsman.find({ inningsId, status: "not out" });
    const striker = batsman.find((b) => b.isStriker);
    const nonStriker = batsman.find((b) => !b.isStriker);

    if (wicket) {
      if (wicket.type === "run out") {
        const outBatsman = batsman.find((p) => p.player === runsOutBatsmanId);
        outBatsman.status = "out";
        if (!extras || extras.type === "byes" || extras.type === "leg-byes") {
          outBatsman.ballsFaced += 1;
        }
      } else {
        if (!extras || extras.type === "byes" || extras.type === "leg-byes") {
          striker.ballsFaced += 1;
        }
        striker.status = "out";
        striker.isStriker = false;
        over.wicket += 1;
      }
    } else {
      if (runs % 2 === 1) {
        if (!extras) {
          striker.runs += runs;
          striker.ballsFaced += 1;
        }
        if (extras?.type === "byes" || extras?.type === "leg-byes") {
          striker.ballsFaced += 1;
        }
        if (updatedLegalBalls < 6) {
          striker.isStriker = !striker.isStriker;
          nonStriker.isStriker = !nonStriker.isStriker;
        }
        over.runs += runs;
        await striker.save();
        await nonStriker.save();
        await over.save();
      } else {
        if (!extras) {
          striker.runs += runs;
          if (runs === 4) {
            striker["4s"] += 1;
          }
          if (runs === 6) {
            striker["6s"] += 1;
          }
          striker.ballsFaced += 1;
        }
        if (extras?.type === "byes" || extras?.type === "leg-byes") {
          striker.ballsFaced += 1;
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
