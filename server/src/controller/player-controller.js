import createError from "http-errors";

import { Team } from "../models/team-model.js";
import { successResponse } from "./response-controller.js";
import { Player } from "../models/player-model.js";

export const handleGetAllPlayersOfATeam = async (req, res, next) => {
  try {
    const id = req.params.id;
    const team = await Team.findById(id);
    if (!team) {
      throw createError(404, "No team found");
    }

    const players = await Player.find({ team: id });

    return successResponse(res, {
      message: "Players are fetched successfull.",
      statusCode: 200,
      payload: players,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetSinglePlayer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const player = await Player.findById(id);
    if (!player) {
      throw createError(404, "No player found.");
    }
    return successResponse(res, {
      message: "player is found successfull.",
      statusCode: 200,
      payload: player,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreatePlayer = async (req, res, next) => {
  try {
    const { name, role, battingStyle, bowlingStyle } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      throw createError(404, "No team found");
    }

    const player = await Player.create({
      name,
      role,
      battingStats: { battingStyle },
      bowlingStats: { bowlingStyle },
      team: req.params.id,
    });
    if (!player) {
      throw createError(500, "Failed to create player");
    }

    team.players.push(player);

    await team.save();

    return successResponse(res, {
      message: "player is created successfull.",
      statusCode: 201,
      payload: player,
    });
  } catch (error) {
    next(error);
  }
};

export const handleEditPlayer = async (req, res, next) => {
  try {
    return successResponse(res, {
      message: "player is edited successfull.",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
