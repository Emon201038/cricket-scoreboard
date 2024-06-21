import express from "express";
import morgan from "morgan";
import cors from "cors";
import { matchRouter } from "./src/routes/match-route.js";
import { teamRouter } from "./src/routes/team-route.js";
import { overRouter } from "./src/routes/over-route.js";
import { ballRouter } from "./src/routes/ball-route.js";
import { playerRouter } from "./src/routes/player-route.js";
import { inningsRouter } from "./src/routes/innings-route.js";
import { batsmanRouter } from "./src/routes/batsman-route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/matches", matchRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/overs", overRouter);
app.use("/api/v1/balls", ballRouter);
app.use("/api/v1/players", playerRouter);
app.use("/api/v1/innings", inningsRouter);
app.use("/api/v1/batsman", batsmanRouter);

app.use((req, res, next) => {
  res.status(400).json({
    success: false,
    message: "Route not found",
  });
});

app.use("/", (req, res) =>
  res.status(200).json({ message: "welcome to home route of scorboard app" })
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

export { app };
