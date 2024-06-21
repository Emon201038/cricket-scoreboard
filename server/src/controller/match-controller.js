import createError from "http-errors";

import { Match } from "../models/match-model.js";
import { successResponse } from "./response-controller.js";

export const handleMatchCreate = async (req, res, next) => {
  try {
    const {
      venue,
      team1,
      team2,
      tossWinner,
      decision,
      maxOver,
      maxOverPerBowler,
      players,
    } = req.body;
    const match = await Match.create({
      venue,
      teams: [team1, team2],
      toss: { winner: tossWinner, decision },
      players,
      maxOver,
      maxOverPerBowler,
    });
    if (!match) {
      throw createError(400, "Failed to create match");
    }
    return successResponse(res, {
      message: "Match is created successfull.",
      statusCode: 201,
      payload: match,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllMatches = async (req, res, next) => {
  try {
    const matches = await Match.find()
      .populate({
        path: "toss.winner",
        model: "Team",
        select: ["name"],
      })
      .populate({
        path: "teams",
        model: "Team",
        select: "name",
      });
    return successResponse(res, {
      message: "Matches are fetched successfull.",
      statusCode: 200,
      payload: matches,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindMatchById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const match = await Match.findById(id)
      .populate({
        path: "toss.winner",
        model: "Team",
        select: ["name"],
      })
      .populate({
        path: "teams",
        model: "Team",
        select: "name",
      })
      .populate({
        path: "Innings",
        model: "Innings",
      });
    if (!match) {
      throw createError(404, "No match found");
    }
    return successResponse(res, {
      message: "Match is found successfull.",
      statusCode: 200,
      payload: match,
    });
  } catch (error) {
    next(error);
  }
};
