import { Schema, model } from "mongoose";

const matchSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    venue: String,
    status: {
      type: String,
      default: "live",
    },
    maxOver: {
      type: Number,
      required: [true, "max over is required"],
    },
    maxOverPerBowler: {
      type: Number,
      required: [true, "max over per is required"],
    },
    players: {
      type: Number,
      required: [true, "players number is required"],
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "team id is required"],
        ref: "Team",
      },
    ],
    Innings: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "innings id is required"],
        ref: "Innings",
      },
    ],
    toss: {
      winner: {
        type: Schema.Types.ObjectId,
        required: [true, "team id is required"],
        ref: "Team",
      },
      decision: {
        type: String,
        enum: ["bat", "bowl"],
      },
    },
    result: String,
  },
  { timestamps: true }
);

export const Match = model("Match", matchSchema);
