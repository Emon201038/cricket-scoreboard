import createError from "http-errors";

import { Innings } from "../models/innings-model.js";
import { successResponse } from "./response-controller.js";
import { Batsman } from "../models/batsman-model.js";

export const handle_get_all_batsman = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    const innings = await Innings.findById(inningsId);
    if (!innings) {
      throw createError(404, "No innings found");
    }

    const batsmans = await Batsman.find({ inningsId });

    return successResponse(res, {
      message: "Batsman fetched successfull",
      payload: batsmans,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_get_single_batsman = async (req, res, next) => {
  try {
    const batsmanId = req.params.batsmanId;
    const batsman = await Batsman.findById(batsmanId);
    if (!batsman) {
      throw createError(404, "No batsman found");
    }

    return successResponse(res, {
      message: "Batsman found successfull",
      payload: batsman,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_create_batsman = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    const { teamId, playerId, isStriker } = req.body;
    if (!teamId) {
      throw createError(400, "team id is required");
    }
    if (!playerId) {
      throw createError(400, "player id is required");
    }
    if (!isStriker) {
      throw createError(400, "isStriker is required");
    }

    const innings = await Innings.findOne({ teamId, _id: inningsId });
    if (!innings) {
      throw createError(404, "No innings found.");
    }

    const isExists = await Batsman.findOne({ teamId, playerId });
    if (isExists) {
      throw createError(409, "Player is already in the field");
    }

    const isPlaying = innings.playingPlayers.some(
      (id) => id.toString() === playerId.toString()
    );
    if (!isPlaying) {
      throw createError(400, "Player is not playing of this innings");
    }

    const batsman = await Batsman.create({
      teamId,
      playerId,
      inningsId,
      isStriker,
    });
    return successResponse(res, {
      message: "Batsman created successfull",
      statusCode: 201,
      payload: batsman,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_edit_batsman = async (req, res, next) => {
  try {
    const batsmanId = req.params.batsmanId;
    const { runs, ballsFaced, isStriker } = req.body;

    // Validate and parse runs and ballsFaced
    const parsedRuns = parseInt(runs);
    const parsedBallsFaced = parseInt(ballsFaced);

    if (isNaN(parsedRuns) || isNaN(parsedBallsFaced)) {
      throw createError(400, "Invalid runs or ballsFaced provided.");
    }

    // Update batsman's runs and ballsFaced
    const updatedBatsman = await Batsman.findByIdAndUpdate(
      batsmanId,
      {
        $inc: { ballsFaced: parsedBallsFaced, runs: parsedRuns },
      },
      { new: true }
    );

    if (!updatedBatsman) {
      throw createError(404, "No batsman found.");
    }

    // Handle isStriker separately, assuming it's a boolean
    updatedBatsman.isStriker = isStriker;
    await updatedBatsman.save();

    return successResponse(res, {
      message: "Batsman edited successfull",
      payload: updatedBatsman,
    });
  } catch (error) {
    next(error);
  }
};
