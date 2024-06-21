import express from "express";
import {
  handleFindMatchById,
  handleGetAllMatches,
  handleMatchCreate,
} from "../controller/match-controller.js";

const matchRouter = express.Router();

// GET: /api/v1/matches
matchRouter.get("/", handleGetAllMatches);

//POST:-> /api/v1/matches
matchRouter.post("/", handleMatchCreate);

//GET:-> /api/v1/matches/:id
matchRouter.get("/:id([a-fA-F0-9]{24})", handleFindMatchById);

export { matchRouter };
