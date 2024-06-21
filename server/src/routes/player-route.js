import express from "express";
import {
  handleCreatePlayer,
  handleEditPlayer,
  handleGetAllPlayersOfATeam,
  handleGetSinglePlayer,
} from "../controller/player-controller.js";

const playerRouter = express.Router();

// GET: /api/v1/players/:id(teamId)
playerRouter.get("/:id([A-Fa-f0-9]{24})", handleGetAllPlayersOfATeam);

// GET: /api/v1/players/get/:id(playerId)
playerRouter.get("/get/:id([A-Fa-f0-9]{24})", handleGetSinglePlayer);

// POST: /api/v1/players/:id(teamId)
playerRouter.post("/:id([A-Fa-f0-9]{24})", handleCreatePlayer);

// PUT: /api/v1/players/edit/:id(playerId)
playerRouter.put("/edit/:id([A-Fa-f0-9]{24})", handleEditPlayer);

export { playerRouter };
