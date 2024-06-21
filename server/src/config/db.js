import mongoose from "mongoose";
import { dbUrl } from "../../secret.js";

const db = async (req, res, next) => {
  try {
    mongoose
      .connect(dbUrl)
      .then(() => console.log("DB connection established"));
    mongoose.connection.on("error", (err) =>
      console.log("Database connection error", err)
    );
  } catch (error) {
    console.log(error);
  }
};
export default db;
