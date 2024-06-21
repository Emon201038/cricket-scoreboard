import { Schema, model } from "mongoose";

const teamSchema = new Schema(
  {
    name: String,
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    captain: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
    wicketKipper: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
    homeVenue: String,
    matchPlayed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Innings",
      },
    ],
  },
  { timestamps: true }
);

export const Team = model("Team", teamSchema);
