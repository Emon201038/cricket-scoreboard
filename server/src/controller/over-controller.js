import mongoose from "mongoose";
import { Bowler } from "../models/bowler-model.js";
import { Innings } from "../models/innings-model.js";
import { Match } from "../models/match-model.js";
import { Over } from "../models/over-model.js";
import { Player } from "../models/player-model.js";
import { isPlayerPlaying } from "../utils/checkPlayerPlaying.js";
import { successResponse } from "./response-controller.js";
import createError from "http-errors";

export const handleGetAllOverOfAnInnings = async (req, res, next) => {
  try {
    const inningsId = req.params.inningsId;
    if (!inningsId) {
      throw createError(400, "Please enter an innings id");
    }

    const overs = await Over.find({ inningsId }).populate([
      {
        path: "balls",
        select: ["extras", "runs", "wicket", "event"],
      },
      {
        path: "bowler",
        select: "name",
      },
    ]);
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //checking innings existence
    const inningsId = req.params.inningsId;
    const innings = await Innings.findById(inningsId).populate({
      path: "matchId",
      model: Match,
      select: ["maxOverPerBowler", "maxOver", "teams", "toss"],
      populate: [
        {
          path: "teams.playingXi",
          model: "Player",
          select: "name",
        },
      ],
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
        "This innings has completed. You cannot create new over anymore"
      );
    }

    //checking player existence
    const bowlerId = req.body.bowler;
    const player = await Player.findById(bowlerId);
    if (!player) {
      throw createError(404, "Invalid player selected. Player is not found");
    }

    //checking this player is playing or not in this innings
    const tossWinner = innings.matchId?.toss?.winner;
    const bowlingTeam = innings.matchId.teams.find(
      (t) => t.team.toString() !== tossWinner.toString()
    );
    const isPlaying = isPlayerPlaying(bowlingTeam, bowlerId);
    if (!isPlaying) {
      throw createError(400, `${player.name} is not playing in this innings`);
    }

    //checking bowler availability for over
    const prevOverOfBowler = await Over.find({ inningsId, bowlerId });
    if (prevOverOfBowler.length >= innings.matchId.maxOverPerBowler) {
      throw createError(
        400,
        `${player.name} cannot ball. He has complete his limit.`
      );
    }

    const prevOvers = await Over.find({ inningsId })
      .populate({
        path: "balls",
        model: "Ball",
      })
      .lean();

    if (prevOvers.length > 0) {
      const lastOver = prevOvers[prevOvers.length - 1];
      console.log(lastOver.bowler.toString(), bowlerId.toString());
      if (lastOver.bowler.toString() === bowlerId.toString()) {
        throw createError(
          400,
          "This bowler is ball previous over. Plesase select another bowler"
        );
      }

      const legalBall = lastOver?.balls.filter((item) => {
        return (
          item.extras === null ||
          (item.extras.type !== "wide" && item.extras.type !== "no-ball")
        );
      }).length;
      console.log(legalBall);
      if (legalBall < 6) {
        throw createError(
          400,
          "Please finish the previous over to create a new over."
        );
      }
    }

    if (player.team.toString() !== req.body.team?.toString()) {
      throw createError(
        400,
        "The selected bowler is not playing the team that you provided."
      );
    }

    const prevBowler = await Bowler.findOne({ player: bowlerId });
    if (!prevBowler) {
      const newbowler = new Bowler({
        player: bowlerId,
        innings: inningsId,
        team: req.body.team,
      });

      await newbowler.save({ session });
    }

    console.log(bowlerId, inningsId);

    const over = new Over({ bowler: bowlerId, inningsId });

    await over.save({ session });
    if (!over) {
      throw createError(500, "Failed to create over. Please try again");
    }

    session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Over is created successfull",
      statusCode: 201,
      payload: over,
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
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
