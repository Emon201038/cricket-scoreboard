import { Schema, model } from "mongoose";

const inningsSchema = new Schema(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: [true, "Match id is required"],
    },
    playingPlayers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    bowlers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    balls: {
      type: Number,
      default: 0,
    },
    extras: {
      wides: {
        type: Number,
        default: 0,
      },
      noBalls: {
        type: Number,
        default: 0,
      },
      byes: {
        type: Number,
        default: 0,
      },
      legByes: {
        type: Number,
        default: 0,
      },
    },
    overs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Over",
      },
    ],
    fallsOfWicket: [
      {
        run: Number,
        over: Number,
        batsman: {
          type: Schema.Types.ObjectId,
          ref: "Batsman",
        },
        bowler: {
          type: Schema.Types.ObjectId,
          ref: "Bowler",
        },
        fielder: {
          type: Schema.Types.ObjectId,
          ref: "Player",
        },
      },
    ],
    comentry: [],
  },
  { timestamps: true }
);

export const Innings = model("Innings", inningsSchema);
