import { PrismaClient } from "../../../generated/prisma";

// add try/catch blocks for every prisma function

// const user = await db?.project.create({
//   data: {
//     name: "",
//   },
// });

export const db = new PrismaClient();

if (!db) {
  throw new Error("Database not intialzied");
}
