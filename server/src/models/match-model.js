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
      enum: ["upcoming", "delay", "live", "innings break", "suspended"],
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
        team: {
          type: Schema.Types.ObjectId,
          required: [true, "team id is required"],
          ref: "Team",
        },
        playingXi: [
          {
            type: Schema.Types.ObjectId,
            ref: "Player",
          },
        ],
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
    live: {
      innings: Number,
      battingTeam: {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
      runs: {
        type: Number,
        default: 0,
      },
      wicket: {
        type: Number,
        default: 0,
      },
      ball: {
        type: Number,
        default: 0,
      },
      bowlingTeam: {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
      batsmans: [
        {
          type: Schema.Types.ObjectId,
          ref: "Batsman",
        },
      ],
      bowler: {
        type: Schema.Types.ObjectId,
        ref: "Bowler",
      },
      commentary: [
        {
          ball: { type: Number, required: true },
          batsman: { type: String, required: true },
          bowler: { type: String, required: true },
          commentary: { type: String, required: true },
          event: String,
          isWicket: Boolean,
          runs: { type: Number, required: true },
          type: {
            type: String,
            enum: ["normal", "milestone", "wicket"],
            required: true,
          },
          milestone: { type: String },
        },
      ],
      status: {
        type: String,
        enum: ["upcoming", "delay", "live", "innings break", "suspended"],
      },
      result: String,
    },
    result: String,
  },
  { timestamps: true }
);

export const Match = model("Match", matchSchema);
