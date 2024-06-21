import express from "express";
import {
  handleCreateTeam,
  handleEditTeam,
  handleGetAllTeams,
  handleGetSingleTeam,
} from "../controller/team-controller.js";

const teamRouter = express.Router();

// GET: /api/v1/teams
teamRouter.get("/", handleGetAllTeams);

// GET: /api/v1/teams/:id
teamRouter.get("/:id([A-Fa-f0-9]{24})", handleGetSingleTeam);

// POST: /api/v1/teams
teamRouter.post("/", handleCreateTeam);

// PUT: /api/v1/teams/:id
teamRouter.put("/:id([A-Fa-f0-9]{24})", handleEditTeam);

export { teamRouter };
