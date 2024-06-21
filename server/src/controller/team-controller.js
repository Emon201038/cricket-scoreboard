import createError from "http-errors";

import { Team } from "../models/team-model.js";
import { successResponse } from "./response-controller.js";

export const handleGetAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();
    return successResponse(res, {
      message: "Teams fetched successfull.",
      payload: teams,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetSingleTeam = async (req, res, next) => {
  try {
    const id = req.params.id;
    const team = await Team.findById(id).lean();
    if (!team) {
      throw createError(404, "No team found");
    }
    return successResponse(res, {
      message: "Team fetched successfull.",
      payload: team,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateTeam = async (req, res, next) => {
  try {
    const { name, homeVenue } = req.body;

    const team = await Team.create({ name, homeVenue });
    if (!team) {
      throw createError(400, "Failed to create team.");
    }
    return successResponse(res, {
      message: "Team is created successfull.",
      statusCode: 201,
      payload: team,
    });
  } catch (error) {
    next(error);
  }
};

export const handleEditTeam = async (req, res, next) => {
  try {
    return successResponse(res, { message: "Team is edited successfull." });
  } catch (error) {
    next(error);
  }
};
