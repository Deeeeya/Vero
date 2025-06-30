import { PrismaClient } from "../../../generated/prisma";

let db: null | PrismaClient = null;

if (!db) {
  try {
    db = new PrismaClient({
      log: ["error", "warn"],
    });
    console.log("Prisma Client was created successfully!");
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    db = null;
  }
}

// add try/catch blocks for every prisma function

// const user = await db?.project.create({
//   data: {
//     name: "",
//   },
// });

export { db };
