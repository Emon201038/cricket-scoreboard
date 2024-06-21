import createError from "http-errors";

import { Ball } from "../models/balls-model.js";
import { Over } from "../models/over-model.js";
import { successResponse } from "./response-controller.js";
import { Player } from "../models/player-model.js";
import { Innings } from "../models/innings-model.js";

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
    const { bowlerId, batsmanId } = req.body;

    //checking over existence
    const over = await Over.findById(overId);
    if (!over) {
      throw createError(404, "No over found");
    }

    //checking player existence
    const bowler = await Player.findById(bowlerId);
    if (!bowler) {
      throw createError(404, "Bowler is not valid player");
    }

    //checking innings existence
    const innings = await Innings.findById(over.inningsId);
    if (!innings) {
      throw createError(404, "No innings found");
    }

    //checking player is playing or not
    const isPlaying = innings.playingPlayers.some(
      (id) => id.toString() === bowlerId
    );
    if (!isPlaying) {
      throw createError(404, `${bowler.name} is not playing in this innings`);
    }

    //create ball

    return successResponse(res, {
      message: "Ball is created successfull.",
      statusCode: 201,
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
