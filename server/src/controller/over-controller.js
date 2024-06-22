import { Innings } from "../models/innings-model.js";
import { Match } from "../models/match-model.js";
import { Over } from "../models/over-model.js";
import { Player } from "../models/player-model.js";
import { successResponse } from "./response-controller.js";
import createError from "http-errors";

export const handleGetAllOverOfAnInnings = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    if (!inningsId) {
      throw createError(400, "Please enter an innings id");
    }

    const overs = await Over.find({ inningsId });
    return successResponse(res, {
      message: "Over fetched successfull.",
      payload: overs,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetSingleOver = async (req, res, next) => {
  try {
    const overId = req.params.overId;
    const over = await Over.findById(overId);
    if (!over) {
      throw createError(404, "No over found");
    }
    return successResponse(res, {
      message: "Over found successfull.",
      payload: over,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateOver = async (req, res, next) => {
  try {
    //checking innings existence
    const inningsId = req.params.inningsId;
    const innings = await Innings.findById(inningsId).populate({
      path: "matchId",
      model: Match,
      select: ["maxOverPerBowler", "maxOver"],
    });
    if (!innings) {
      throw createError(404, "No innings found");
    }

    //checking innings over limit is reached or not
    const overFinished = innings.overs.length;
    const overLimit = innings.matchId.maxOver;
    if (overFinished >= overLimit) {
      throw createError(
        400,
        "This innings has completed. You cannot over anymore"
      );
    }

    //checking player existence
    const bowler = req.body.bowler;
    const player = await Player.findById(bowler);
    if (!player) {
      throw createError(404, "Invalid player selected. Player is not found");
    }

    //checking this player is playing or not in this innings
    const isPlaying = innings.playingPlayers.some(
      (p) => p.toString() === bowler.toString()
    );
    if (!isPlaying) {
      throw createError(400, `${player.name} is not playing in this innings`);
    }

    //checking bowler availability for over
    const prevOverOfBowler = await Over.find({ inningsId, bowler });
    if (prevOverOfBowler.length >= innings.matchId.maxOverPerBowler) {
      throw createError(
        400,
        `${player.name} cannot ball. He has complete his limit.`
      );
    }

    const over = await Over.create({ bowler, inningsId });
    if (!over) {
      throw createError(500, "Failed to create over. Please try again");
    }

    return successResponse(res, {
      message: "Over is created successfull",
      statusCode: 201,
      payload: over,
    });
  } catch (error) {
    next(error);
  }
};

export const handleEditOver = async (req, res, next) => {
  try {
    return successResponse(res, { message: "Over is edited successfull." });
  } catch (error) {
    next(error);
  }
};
