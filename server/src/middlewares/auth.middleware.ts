import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";

// checks if user is logged in

const auth = createMiddleware(async (c, next) => {
  console.log("auth checked");
  // Get auth headers
  // Get the session ID, check if there is an existing session ID
  // If no session ID, then return 401 unauthorized
  // If there is a session ID, check if it expired (return 401).
  // If session ID hasn't expired, go to the next function.

  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const sessionId = authorization.split(" ")[1];

  if (!sessionId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const session = await db.session.findUnique({
    where: {
      id: sessionId,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("userId", String(session.userId));

  return await next();
});

export { auth };
