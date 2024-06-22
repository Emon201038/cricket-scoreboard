import createError from "http-errors";

import { Ball } from "../models/balls-model.js";
import { Over } from "../models/over-model.js";
import { successResponse } from "./response-controller.js";
import { Player } from "../models/player-model.js";
import { Innings } from "../models/innings-model.js";
import { Batsman } from "../models/batsman-model.js";
import { generate_event_of_a_ball } from "../utils/generateEvent.js";

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
    return successResponse(res, {
      message: "ball is found successfull.",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateBall = async (req, res, next) => {
  try {
    const overId = req.params.overId;
    console.log(overId);
    const {
      bowlerId,
      batsmanId,
      extras = null,
      wicket = null,
      runs,
    } = req.body;

    //checking over existence
    const over = await Over.findById(overId).populate({
      path: "balls",
      model: Ball,
      select: "extras",
    });
    if (!over) {
      throw createError(404, "No over found");
    }

    //checking innings existence
    const innings = await Innings.findById(over.inningsId);
    if (!innings) {
      throw createError(404, "No innings found");
    }

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
    const bowler = await Player.findById(bowlerId);
    if (!bowler) {
      throw createError(404, "Bowler is not valid player");
    }
    const batsman = await Player.findById(batsmanId);
    if (!batsman) {
      throw createError(404, "Batsman is not a valid player");
    }

    //checking batsman existense
    const isBatsmanExists = await Batsman.findOne({
      playerId: batsmanId,
    }).populate({
      path: "inningsId",
      model: Innings,
      select: "matchId",
    });
    if (!isBatsmanExists) {
      throw createError(404, "No batsman found");
    }
    if (
      isBatsmanExists.inningsId.matchId.toString() !==
      innings.matchId.toString()
    ) {
      throw createError(400, "Batsman is not playing this innings");
    }

    //checking player is playing or not
    const isBowlerPlaying = innings.playingPlayers.some(
      (id) => id.toString() === bowlerId
    );
    if (!isBowlerPlaying) {
      throw createError(404, `${bowler.name} is not playing in this innings`);
    }

    //generating event
    const event = generate_event_of_a_ball(extras);

    if (!isBatsmanExists.isStriker) {
      throw createError(404, "please enter a striker batsman id");
    }
    //create ball
    const ball = await Ball.create({
      batsman: batsmanId,
      bowler: bowlerId,
      runs,
      wicket,
      extras,
      overId,
      event,
    });

    await Over.findByIdAndUpdate(overId, { $push: { balls: ball._id } });

    return successResponse(res, {
      message: "Ball is created successfull.",
      statusCode: 201,
      payload: ball,
    });
  } catch (error) {
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
