import express from "express";
import {
  handle_create_batsman,
  handle_edit_batsman,
  handle_get_all_batsman,
  handle_get_not_out_batsman,
  handle_get_single_batsman,
} from "../controller/batsman-controller.js";

const batsmanRouter = express.Router();

//GET:-> /api/v1/batsman/:inningsId
batsmanRouter.get("/:inningsId([a-fA-F0-9]{24})", handle_get_all_batsman);

//GET:-> /api/v1/batsman/not_out/:inningsId
batsmanRouter.get(
  "/not_out/:inningsId([a-fA-f0-9]{24})",
  handle_get_not_out_batsman
);

//GET:-> /api/v1/batsman/:inningsId
batsmanRouter.post("/:inningsId([a-fA-F0-9]{24})", handle_create_batsman);

//GET:-> /api/v1/batsman/get/:batsmanId
batsmanRouter.get(
  "/get/:batsmanId([a-fA-F0-9]{24})/",
  handle_get_single_batsman
);

//GET:-> /api/v1/batsman/edit/:batsmanId
batsmanRouter.put("/edit/:batsmanId([a-fA-F0-9]{24})/", handle_edit_batsman);

export { batsmanRouter };
