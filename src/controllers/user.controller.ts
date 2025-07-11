import { db } from "../lib/db/client";
import { HTTPException } from "hono/http-exception";
import { Context } from "hono";

// GET /api/users - Get all users
export const getUsers = async (c: Context) => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      metadata: true,
    },
  });

  return c.json({
    users,
    count: users.length,
  });
};

// POST /api/users - Create a new user
export const createUser = async (c: Context) => {
  const body = await c.req.json();

  if (!body.email || !body.hashPassword) {
    throw new HTTPException(400, {
      message: "Email and password are required",
    });
  }

  const newUser = await db.user.create({
    data: {
      email: body.email,
      hashPassword: body.hashPassword,
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
      message: "User created successfully!",
      user: newUser,
    },
    201
  );
};

// GET /api/users/:id - Get a specific user
export const getUser = async (c: Context) => {
  const userId = parseInt(c.req.param("id"));

  if (isNaN(userId)) {
    throw new HTTPException(400, { message: "Invalid user ID" });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      metadata: true,
      verifications: {
        select: {
          id: true,
          code: true,
          createdAt: true,
          expiresAt: true,
          isUsed: true,
        },
      },
    },
  });

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return c.json({ user });
};

// PUT /api/users/:id - Update a user
export const updateUser = async (c: Context) => {
  const userId = parseInt(c.req.param("id"));

  if (isNaN(userId)) {
    throw new HTTPException(400, { message: "Invalid user ID" });
  }

  const body = await c.req.json();

  const existingUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const updateData: any = {};
  if (body.email) updateData.email = body.email;
  if (body.hashPassword) updateData.hashPassword = body.hashPassword;
  if (body.metadata !== undefined) updateData.metadata = body.metadata;

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      metadata: true,
    },
  });

  return c.json({
    message: "User updated successfully!",
    user: updatedUser,
  });
};

// DELETE /api/users/:id - Delete a user
export const deleteUser = async (c: Context) => {
  const userId = parseInt(c.req.param("id"));

  if (isNaN(userId)) {
    throw new HTTPException(400, { message: "Invalid user ID" });
  }

  const existingUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new HTTPException(404, { message: "User not found" });
  }

  await db.user.delete({
    where: { id: userId },
  });

  return c.json({
    message: "User deleted successfully!",
  });
};
