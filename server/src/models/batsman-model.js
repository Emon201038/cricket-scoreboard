import { Schema, model } from "mongoose";

const batsmanSchema = new Schema(
  {
    player: {
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
    strikeRate: {
      type: Number,
      default: 0,
    },
    "4s": {
      type: Number,
      default: 0,
    },
    "6s": {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["not out", "out"],
      default: "not out",
    },
    out: {
      type: {
        type: String,
      },
      bowler: {
        type: Schema.Types.ObjectId,
        ref: "Bowler",
      },
      fielder: {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
      dismissalText: {
        type: String,
      },
    }, // "not out", "out", "yet to bat"
    isStriker: {
      type: Boolean,
      default: false,
    }, // True if currently the striker
  },
  { timestamps: true }
);

batsmanSchema.pre("save", function (next) {
  if (this.runs > 0 && this.ballsFaced > 0) {
    this.strikeRate = ((this.runs / this.ballsFaced) * 100).toFixed(2);
  } else {
    this.strikeRate = 0;
  }

  next();
});

export const Batsman = model("Batsman", batsmanSchema);
