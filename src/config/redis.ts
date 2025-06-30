import dotenv from "dotenv";

dotenv.config();

export const redis = {
  url: process.env.REDIS_URL,
};
