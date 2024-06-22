import { Schema, model } from "mongoose";

const batsmanSchema = new Schema(
  {
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
    runs: {
      type: Number,
      default: 0,
    },
    ballsFaced: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["not out", "out"],
      default: "not out",
    }, // "not out", "out", "yet to bat"
    isStriker: Boolean, // True if currently the striker
  },
  { timestamps: true }
);

export const Batsman = model("Batsman", batsmanSchema);
