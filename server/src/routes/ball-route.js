import express from "express";
import {
  handleCreateBall,
  handleEditBall,
  handleGetAllBallsOfAnOver,
  handleGetSingleBall,
} from "../controller/ball-controller.js";

const ballRouter = express.Router();

// GET: /api/v1/balls/get/:id(ballId)
ballRouter.get("/get/:id([A-Fa-f0-9]{24})", handleGetSingleBall);

// GET: /api/v1/balls/:id(overId)
ballRouter.get("/:id([A-Fa-f0-9]{24})", handleGetAllBallsOfAnOver);

// POST: /api/v1/balls/:id(overId)
ballRouter.post("/:id([A-Fa-f0-9]{24})", handleCreateBall);

// POST: /api/v1/balls/edit/:id(ballId)
ballRouter.put("/edit/:id([A-Fa-f0-9]{24})", handleEditBall);

export { ballRouter };
