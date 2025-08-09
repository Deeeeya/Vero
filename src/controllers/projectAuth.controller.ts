import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";
import bcrypt from "bcrypt";

// POST /api/projectAuth - create new account
export const signUp = async (c: Context) => {
  // define body
  // check to see if valid email and password
  // check if user exists
  // hash the password
  // create the new user
  // return the new user
  const body = await c.req.json();

  if (!body.email || !body.password) {
    throw new HTTPException(400, { message: "Email or password required" });
  }

  const existingUser = await db.projectUser.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new HTTPException(400, {
      message: "User with this email already exists",
    });
  }

  const salt = 12;
  const hashPassword = await bcrypt.hash(body.password, salt);

  const newUser = await db.projectAuth.create({
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
      message: "Account created successfully!",
      user: newUser,
    },
    201
  );
};
// POST /api/projectAuth - sign in to account
export const signIn = async (c: Context) => {
  // check user input validation
  // check to see if email/password is correct
  // create access token
  // create a session as soon as user signs in
  // return message and session
  const body = await c.req.json();

  if (!body.email || !body.password) {
    throw new HTTPException(400, { message: "Email or password required" });
  }

  const user = await db.projectUser.findFirst({
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

  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  const userSession = await db.userSession.create({
    data: {
      userId: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessExpiration: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      refreshExpiration: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 days
    },
    select: {
      id: true,
      userId: true,
      createdAt: true,
      accessExpiration: true,
      refreshExpiration: true,
      accessToken: true,
      refreshToken: true,
    },
  });

  return c.json({
    message: "Signed in successfully!",
    accessToken: userSession.accessToken,
    user: {
      id: user.id,
      email: user.email,
    },
  });
};
// DELETE /api/projectAuth - sign out of account
export const signOut = async (c: Context) => {
  // define authorization header
  // get session id from authorization header (split authorization and get the token)
  // define the session and check to see if the session exists
  // delete the session
  // return json
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const accessToken = authorization.split(" ")[1];

  if (!accessToken) {
    throw new HTTPException(400, { message: "Access token is required" });
  }

  const userSession = await db.userSession.findFirst({
    where: { accessToken: accessToken },
  });

  if (!userSession) {
    throw new HTTPException(400, { message: "Invalid session" });
  }

  await db.userSession.delete({
    where: { id: userSession.id },
  });

  return c.json({
    message: "Signed out successfully!",
  });
};
