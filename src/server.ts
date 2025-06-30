import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { auth } from "./middlewares/auth.middleware";
import { getRedisClient, initRedis } from "./lib/redis/client";
import { db } from "./lib/db/client";

const app = new Hono();

app.use(secureHeaders());
app.use(cors());
app.use(logger());
app.use("/api/*", auth);

app.get("/health", async (c) => {
  try {
    const redis = await getRedisClient();
    await redis.ping();

    //test database

    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      redis: "connected",
      message: "Server and Redis are healthy!",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return c.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        redis: "disconnected",
        error: errorMessage,
        message: "Redis connection failed",
      },
      503
    );
  }
});

app.get("/api/cache-test", async (c) => {
  const redis = await getRedisClient();

  await redis.setEx("test-key", 60, "Added to database!");

  const value = await redis.get("test-key");

  try {
    return c.json({
      message: "Redis is working!",
      stored: "test-key",
      retrieved: value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json(
      {
        error: "Redis operation failed",
        details: errorMessage,
      },
      500
    );
  }
});

app.get("/api/users", async (c) => {
  try {
    if (!db) {
      return c.json({ message: "Database client not found" }, 500);
    }
    const users = await db.user.findMany();
    return c.json({
      users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database query failed:", error);
    return c.json(
      {
        error: "Database connection failed",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/api/data", (c) => {
  return c.json({ message: "Anyone can access this API!" });
});

const port = 3000;

async function startServer() {
  try {
    await initRedis();
    serve({ fetch: app.fetch, port });
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

console.log(`Server running on localhost:${port}`);
