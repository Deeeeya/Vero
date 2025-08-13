import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";

export const projectAuthMiddleware = createMiddleware(async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const accessToken = authorization.split(" ")[1];

  if (!accessToken) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const session = await db.userSession.findFirst({
    where: {
      accessToken: accessToken,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          enabled: true,
        },
      },
    },
  });

  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (session.accessExpiration < new Date()) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (session.revokedAt) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (!session.user.enabled) {
    throw new HTTPException(403, { message: "Account disabled" });
  }

  c.set("userId", String(session.userId));

  await next();
});
