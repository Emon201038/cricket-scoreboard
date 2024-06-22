import { Schema, model } from "mongoose";

const ballSchema = new Schema(
  {
    overId: {
      type: Schema.Types.ObjectId,
      ref: "Over",
      required: [true, "Over id is required"],
    },
    batsman: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "batsman id is required"],
    },
    bowler: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "bowler id is required"],
    },
    runs: {
      type: Number,
      default: 0,
    },
    extras: {
      type: { type: String },
      runs: Number,
    },
    wicket: {
      type: { type: String },
      fielder: {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    },
    event: String,
  },
  { timestamps: true }
);

export const Ball = model("Ball", ballSchema);
