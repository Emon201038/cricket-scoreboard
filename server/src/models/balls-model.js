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
      ref: "Batsman",
      required: [true, "batsman id is required"],
    },
    bowler: {
      type: Schema.Types.ObjectId,
      ref: "Bowler",
      required: [true, "bowler id is required"],
    },
    runs: {
      type: Number,
      default: 0,
    },
    extras: {
      type: {
        type: String,
        enum: ["byes", "leg-byes", "no-ball", "wide"],
      },
      runs: Number,
    },
    wicket: {
      type: {
        type: String,
        enum: ["runOut", "caught", "stumping", "bowled", "lbw", "hit", "timed"],
      },
      fielder: {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
      outBatsman: {
        type: Schema.Types.ObjectId,
        ref: "Batsman",
      },
    },
    event: String,
  },
  { timestamps: true }
);

// Method to generate the event string
ballSchema.methods.generateEvent = function () {
  if (this.wicket && this.wicket.type) {
    this.event = this.runs > 0 ? `w${this.runs}` : "w";
  } else if (this.extras && this.extras.type) {
    if (this.extras.type === "wide") {
      this.event = `wd${this.extras.runs || ""}`;
    } else if (this.extras.type === "no-ball") {
      this.event = `nb${this.runs}`;
    } else if (this.extras.type === "byes") {
      this.event = `b${this.extras.runs}`;
    } else if (this.extras.type === "leg-byes") {
      this.event = `lb${this.extras.runs}`;
    }
  } else {
    if (this.runs === 0) {
      this.event = "0";
    } else {
      this.event = `${this.runs}`;
    }
  }
};

// Pre-save middleware to set the event string before saving
ballSchema.pre("save", function (next) {
  this.generateEvent();
  next();
});

export const Ball = model("Ball", ballSchema);
