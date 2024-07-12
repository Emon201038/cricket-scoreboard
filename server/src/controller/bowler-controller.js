import { Bowler } from "../models/bowler-model.js";
import { successResponse } from "./response-controller.js";
import createError from "http-errors";

export const handle_create_bowler = async (req, res, next) => {
  try {
    const { playerId, teamId, inningsId } = req.body;
    const bowler = await Bowler.create({ playerId, teamId, inningsId });
    return successResponse(res, {
      message: "Bowler is created successfull.",
      statusCode: 201,
      payload: bowler,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_get_all_bowlers_of_an_innings = async (req, res, next) => {
  try {
    const innings = req.params.innings;
    const bowlers = await Bowler.find({ innings }).populate({
      path: "player",
      model: "Player",
      select: "name",
    });
    return successResponse(res, {
      message: "bowlers found successfull",
      payload: bowlers,
    });
  } catch (error) {
    next(error);
  }
};

export const handle_get_single_bowler = async (req, res) => {
  try {
    const bowlerId = req.params.bowlerId;
    const bowler = await Bowler.findById(bowlerId).populate("player", "name");
    if (!bowler) {
      throw createError(404, "No bowler found");
    }

    return successResponse(res, {
      message: "Bowler found successfull",
      payload: bowler,
    });
  } catch (error) {
    next(error);
  }
};
