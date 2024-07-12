import express from "express";
import {
  handle_get_all_bowlers_of_an_innings,
  handle_get_single_bowler,
} from "../controller/bowler-controller.js";
const bowlerRouter = express.Router();

bowlerRouter.get(
  "/:innings([a-fA-F0-9]{24})",
  handle_get_all_bowlers_of_an_innings
);

bowlerRouter.get("/get/:bowlerId([a-fA-F0-9]{24})", handle_get_single_bowler);

export { bowlerRouter };
