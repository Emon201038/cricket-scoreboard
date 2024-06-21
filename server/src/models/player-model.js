import { Schema, model } from "mongoose";

const playerSchema = new Schema(
  {
    name: String,
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    role: {
      type: String,
      enum: ["batsman", "bowler", "all-rounder"],
    },
    battingStats: {
      style: {
        type: String,
        enum: ["right-hand", "left-hand"],
      },
      matches: {
        type: Number,
        default: 0,
      },
      runs: {
        type: Number,
        default: 0,
      },
      average: {
        type: Number,
        default: 0,
      },
      StrikeRate: {
        type: Number,
        default: 0,
      },
      centuries: {
        type: Number,
        default: 0,
      },
      halfCenturies: {
        type: Number,
        default: 0,
      },
    },
    bowlingStats: {
      style: {
        type: String,
        enum: ["right-hand", "left-hand"],
      },
      match: {
        type: Number,
        default: 0,
      },
      wickets: {
        type: Number,
        default: 0,
      },
      average: {
        type: Number,
        default: 0,
      },
      economy: {
        type: Number,
        default: 0,
      },
      "3-wicket-haul": {
        type: Number,
        default: 0,
      },
      "5-wicket-haul": {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export const Player = model("Player", playerSchema);
