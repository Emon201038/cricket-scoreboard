import { Schema, model } from "mongoose";

const bowlerSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: [true, "playerId is required"],
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: [true, "Team id is required"],
  },
  innings: {
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

bowlerSchema.pre("save", function (next) {
  if (this.overBowled > 0) {
    this.economy = ((this.runsConceded / this.overBowled) * 6).toFixed(2);
  } else {
    this.economy = 0;
  }
  next();
});

export const Bowler = model("Bowler", bowlerSchema);
