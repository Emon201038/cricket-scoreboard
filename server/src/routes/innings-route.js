import express from "express";
import {
  handle_add_playing_players_to_innings,
  handle_create_innings,
  handle_get_all_innings_of_a_match,
  handle_get_single_innings,
} from "../controller/innings-controller.js";

const inningsRouter = express.Router();

inningsRouter.get(
  "/:matchId([a-fA-F0-9]{24})",
  handle_get_all_innings_of_a_match
);

inningsRouter.get(
  "/get/:inningsId([a-fA-F0-9]{24})",
  handle_get_single_innings
);

inningsRouter.post("/:matchId([a-fA-F0-9]{24})", handle_create_innings);

inningsRouter.put(
  "/:inningsId([a-fA-F0-9]{24})/players",
  handle_add_playing_players_to_innings
);

inningsRouter.get(
  "/get/:inningsId([a-fA-F0-9]{24})",
  handle_get_single_innings
);

export { inningsRouter };
