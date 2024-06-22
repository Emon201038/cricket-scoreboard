import { Schema, model } from "mongoose";

const bowlerSchema = new Schema({
  playerId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: [true, "playerId is required"],
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: [true, "playerId is required"],
  },
  inningsId: {
    type: Schema.Types.ObjectId,
    ref: "Innings",
    required: [true, "playerId is required"],
  },
  overBowled: {
    type: Number,
    default: 0,
  },
  runsConceded: {
    type: Number,
    default: 0,
  },
  wicketTaken: {
    type: Number,
    default: 0,
  },
  maidens: {
    type: Number,
    default: 0,
  },
  economy: {
    type: Number,
    default: 0,
  },
});

export const Bowler = model("Bowler", bowlerSchema);
