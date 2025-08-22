import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";

const apiAuthenticator = createMiddleware(async (c, next) => {
  // check the "x-api-key" and "Authorization" for an api key
  // take which ever api key you found, and compare it to the mock api key
  // two outcomes, either the api key is the correct one or its not
  // if the api key is the correct one, we take them to the next route/middleware
  // if it is not correct, we return a 401 response (unauthorized)
  const apiKey = c.req.header("x-api-key");
  const authorizationKey = c.req.header("Authorization");

  if (!apiKey) {
    throw new HTTPException(401, { message: "API Key Missing" });
  }

  const validApiKey = process.env.MOCK_API_KEY;

  if (!validApiKey) {
    throw new HTTPException(500, { message: "Server Error" });
  }

  if (apiKey !== validApiKey) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const projectId = c.req.header("x-project-id");

  if (!projectId) {
    throw new HTTPException(401, { message: "Missing Project ID" });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new HTTPException(401, { message: "Invalid Project ID" });
  }

  c.set("projectId", String(projectId));

  if (apiKey === validApiKey) {
    return await next();
  }
  throw new HTTPException(401, { message: "Unauthorized" });
});

export { apiAuthenticator };
