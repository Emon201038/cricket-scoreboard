import { Schema, model } from "mongoose";

const overSchema = new Schema(
  {
    inningsId: {
      type: Schema.Types.ObjectId,
      ref: "Innings",
      required: [true, "Innings id is required"],
    },
    bowler: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "bowler is required"],
    },
    runs: {
      type: Number,
      default: 0,
    },
    wicket: {
      type: Number,
      default: 0,
    },
    balls: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ball",
      },
    ],
  },
  { timestamps: true }
);

export const Over = model("Over", overSchema);
