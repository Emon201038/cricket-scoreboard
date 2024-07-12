import createError from "http-errors";

import { Innings } from "../models/innings-model.js";
import { successResponse } from "./response-controller.js";
import { Batsman } from "../models/batsman-model.js";
import { Match } from "../models/match-model.js";
import mongoose from "mongoose";

export const handle_get_all_batsman = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    const innings = await Innings.findById(inningsId);
    if (!innings) {
      throw createError(404, "No innings found");
    }

    const batsmans = await Batsman.find({ inningsId }).populate(
      "player",
      "name"
    );

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
    const { teamId, player } = req.body;
    if (!teamId) {
      throw createError(400, "team id is required");
    }
    if (!player) {
      throw createError(400, "player id is required");
    }

    const innings = await Innings.findOne({ teamId, _id: inningsId }).populate(
      "matchId",
      "teams"
    );
    if (!innings) {
      throw createError(404, "No innings found.");
    }

    const isExists = await Batsman.findOne({ teamId, player });
    if (isExists) {
      throw createError(409, "Player is already in the field");
    }

    const match = await Match.findOne({
      Innings: { $in: [new mongoose.Types.ObjectId(inningsId)] },
    });

    const battingTeam =
      match.toss.decision === "bat"
        ? match.teams.find(
            (t) => t.team.toString() === match.toss.winner.toString()
          )
        : match.teams.find(
            (t) => t.team.toString() !== match.toss.winner.toString()
          );

    const isPlaying = battingTeam.playingXi.some(
      (id) => id.toString() === player.toString()
    );
    if (!isPlaying) {
      throw createError(400, "Player is not playing of this innings");
    }

    const prevBatsman = await Batsman.find({ inningsId, status: "not out" });
    if (prevBatsman.length > 1) {
      throw createError(
        400,
        "There is already 2 batsman in the crease. You cannot more batsman."
      );
    }
    let striker = true;
    const isStriker = prevBatsman.find((b) => b.isStriker);
    if (isStriker) {
      striker = false;
    }

    const batsman = await Batsman.create({
      teamId,
      player,
      inningsId,
      isStriker: striker,
    });
    return successResponse(res, {
      message: "Batsman created successfull",
      statusCode: 201,
      payload: batsman,
    });
  } catch (error) {
    console.log(error);
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

export const handle_get_not_out_batsman = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    const innings = await Innings.findById(inningsId);
    if (!innings) {
      throw createError(404, "Innings is not found.");
    }

    const batsman = await Batsman.find({
      inningsId,
      status: "not out",
    }).populate("player", "name");

    return successResponse(res, {
      message: "Batsman found successfull",
      payload: batsman,
    });
  } catch (error) {
    next(error);
  }
};
