import createError from "http-errors";

import { Innings } from "../models/innings-model.js";
import { successResponse } from "./response-controller.js";
import { Match } from "../models/match-model.js";
import { Team } from "../models/team-model.js";
import { Player } from "../models/player-model.js";

export const handle_get_all_innings_of_a_match = async (req, res, next) => {
  try {
    const id = req.params.matchId;

    const match = await Match.findById(id)
      .populate([
        {
          path: "teams",
          model: Team,
          select: "name",
        },
        {
          path: "toss.winner",
          model: Team,
          select: "name",
        },
      ])
      .lean();
    if (!match) {
      throw createError(404, "No match found");
    }

    const innings = await Innings.find({ matchId: id })
      .populate([
        {
          path: "matchId",
          model: Match,
          select: ["createdAt", "teams", "toss"],
          populate: {
            path: "teams",
            model: "Team",
            populate: {
              path: "playingXi",
              select: "name",
            },
          },
        },
        {
          path: "overs",
          select: ["balls", "runs", "wicket", "bowler"],
          populate: [
            {
              path: "bowler",
              select: "name",
            },
            {
              path: "balls",
              select: "extras",
            },
          ],
        },

        {
          path: "playingPlayers",
          select: "name",
        },
        {
          path: "fallsOfWicket.batsman",
          select: "player",
          populate: {
            path: "player",
            select: "name",
          },
        },
      ])
      .lean();

    return successResponse(res, {
      message: "Innings are fetched successfull.",
      statusCode: 200,
      payload: innings,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_get_single_innings = async (req, res, next) => {
  try {
    const id = req.params.inningsId;

    const innings = await Innings.findById(id)
      .populate({
        path: "playingPlayers",
        model: "Player",
        select: ["name", "role"],
      })
      .populate({
        path: "matchId",
        model: Match,
        select: ["toss", "teams"],
      });
    if (!innings) {
      throw createError(404, "No innings found.");
    }
    return successResponse(res, {
      message: "Innings is found successfull.",
      statusCode: 200,
      payload: innings,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_create_innings = async (req, res, next) => {
  try {
    const id = req.params.matchId;
    const match = await Match.findById(id);
    if (!match) {
      throw createError(404, "No match found");
    }

    const { teamId } = req.body;
    if (!teamId) {
      throw createError(400, "Team Id is required");
    }
    if (!/^[0-9a-fA-F]{24}$/.test(teamId)) {
      throw createError(400, "Invalid team id.");
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw createError(404, "No team found");
    }

    const existingInnings = await Innings.findOne({ teamId, matchId: id });
    if (existingInnings) {
      throw createError(409, "Innings is already exists of this team");
    }

    const innings = await Innings.create({ matchId: id, teamId });

    match.Innings.push(innings._id);
    await match.save();

    return successResponse(res, {
      message: "Innings is created successfull.",
      statusCode: 201,
      payload: innings,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_add_playing_players_to_innings = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    const innings = await Innings.findById(inningsId);
    if (!innings) {
      throw createError(404, "No innings found.");
    }
    const { players } = req.body;

    //checking player existence in the innings
    for (let i = 0; i < players.length; i++) {
      const playerId = players[i];
      const player = await Player.findById(playerId).select("name");

      //checking player is valid or not
      if (!player) {
        throw createError(404, "Player not found");
      }
      innings.playingPlayers.some((id) => {
        if (id.toString() === playerId) {
          throw createError(
            409,
            `The player ${player.name} is already playing in this innings`
          );
        }
      });
    }

    //update innings by pushing all players
    const updatedInnings = await Innings.findByIdAndUpdate(
      inningsId,
      {
        $push: { playingPlayers: { $each: players } },
      },
      { new: true }
    );

    if (!updatedInnings) {
      throw createError(400, "Cannot add players");
    }

    return successResponse(res, {
      message: "Players are added successfull.",
      payload: updatedInnings,
    });
  } catch (error) {
    next(error);
  }
};
