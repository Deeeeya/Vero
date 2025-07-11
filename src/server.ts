import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { apiAuthenticator } from "./middlewares/api.middleware";
import { getRedisClient, initRedis } from "./lib/redis/client";
import { db } from "./lib/db/client";
import { HTTPException } from "hono/http-exception";
import { authRoutes } from "./routes/auth.routes";
import { app } from "./lib/hono/app";

app.use(secureHeaders());
app.use(cors());
app.use(logger());
// app.use("/api/*", apiAuthenticator);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json(
    {
      message: "Internal server error",
    },
    500
  );
});

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

app.route("/api/auth", authRoutes);

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
