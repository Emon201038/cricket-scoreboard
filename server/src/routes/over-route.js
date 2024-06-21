import express from "express";
import {
  handleCreateOver,
  handleEditOver,
  handleGetAllOverOfAnInnings,
  handleGetSingleOver,
} from "../controller/over-controller.js";

const overRouter = express.Router();

// GET: /api/v1/overs/:id(inningsId)
overRouter.get("/:inningsId([A-Fa-f0-9]{24})", handleGetAllOverOfAnInnings);

// GET: /api/v1/overs/:id(inningsId)/:id(overId)
overRouter.get("/get/:overId([A-Fa-f0-9]{24})", handleGetSingleOver);

// POST: /api/v1/overs/:inningsId(inningsId)
overRouter.post("/:inningsId([A-Fa-f0-9]{24})", handleCreateOver);

// PUT: /api/v1/overs/:id(inningsId)/:id(overId)
overRouter.put("/:id([A-Fa-f0-9]{24})", handleEditOver);

export { overRouter };
