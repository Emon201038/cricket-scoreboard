import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 3002;
export const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/cricket";
