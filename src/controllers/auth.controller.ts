import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";
import bcrypt from "bcrypt";

// POST /api/auth/register - Create a new account
export const register = async (c: Context) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    throw new HTTPException(400, {
      message: "Email and password is required",
    });
  }

  const existingUser = await db.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new HTTPException(400, {
      message: "User with this email already exists",
    });
  }
  const salt = 12;
  const hashPassword = await bcrypt.hash(body.password, salt);

  const newUser = await db.user.create({
    data: {
      email: body.email,
      hashPassword: hashPassword,
      metadata: body.metadata || {},
    },
    select: {
      id: true,
      email: true,
      metadata: true,
    },
  });

  return c.json(
    {
      message: "User registered",
      user: newUser,
    },
    201
  );
};

// POST /api/auth/login
export const login = async (c: Context) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    throw new HTTPException(400, { message: "Email and password required" });
  }

  const user = await db.user.findFirst({
    where: { email: body.email },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    body.password,
    user.hashPassword
  );

  if (!isPasswordCorrect) {
    throw new HTTPException(401, { message: "Invalid email or password" });
  }

  const session = await db.session.create({
    data: {
      userId: user.id,
      metadata: {
        loginTime: new Date().toISOString(),
      },
      expiresAt: new Date(Date() + 2 * 60 * 60 * 1000), // 2 hours
    },
    select: {
      id: true,
      userId: true,
      createdAt: true,
      expiresAt: true,
      metadata: true,
    },
  });

  return c.json({
    message: "Login successful!",
    user: {
      id: user.id,
      email: user.email,
      metadata: user.metadata,
    },
    session: session,
  });
};

// POST /api/auth/logout
export const logout = async (c: Context) => {
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const sessionId = authorization.split(" ")[1];

  if (!sessionId) {
    throw new HTTPException(400, { message: "Session ID is required" });
  }

  const session = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new HTTPException(400, { message: "Session not found" });
  }

  await db.session.delete({
    where: { id: sessionId },
  });

  return c.json({
    message: "Logout successful!",
  });
};
