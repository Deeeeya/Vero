import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { db } from "../lib/db/client";

// GET /api/projectUsers - get all projectUsers
export const getProjectUsers = async (c: Context) => {
  const projectUsers = await db.projectUser.findMany({
    select: {
      id: true,
      email: true,
      metadata: true,
      projectId: true,
      project: {
        select: {
          id: true,
          name: true,
          platform: true,
        },
      },
      sessions: {
        select: {
          id: true,
          createdAt: true,
          accessExpiration: true,
        },
      },
    },
  });

  return c.json({
    projectUsers,
    count: projectUsers.length,
  });
};

// POST /api/projectUsers - create projectUser (THIS IS ONLY TO CREATE TEST USERS)
export const createProjectUser = async (c: Context) => {
  const body = await c.req.json();

  // This checks to see if the project exists
  if (!body.email || !body.hashPassword) {
    throw new HTTPException(400, {
      message: "Email and password is required",
    });
  }

  // This checks to see if the email already exists in the project
  if (body.projectId) {
    const projectExists = await db.project.findUnique({
      where: { id: body.projectId },
    });

    if (!projectExists) {
      throw new HTTPException(400, { message: "Project not found" });
    }

    const existingProjectUser = await db.projectUser.findFirst({
      where: { projectId: body.projectId, email: body.email },
    });

    if (existingProjectUser) {
      throw new HTTPException(400, {
        message: "Email already exists in this project",
      });
    }
  }

  const newProjectUser = await db.projectUser.create({
    data: {
      email: body.email,
      hashPassword: body.hashPassword,
      metadata: body.metadata || {},
      projectId: body.projectId || null,
    },
    select: {
      id: true,
      email: true,
      metadata: true,
      projectId: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return c.json(
    {
      message: "Project user successfully created!",
      projectUser: newProjectUser,
    },
    201
  );
};

// GET /api/projectUsers/:id - get a projectUser
export const getProjectUser = async (c: Context) => {
  const projectUserId = c.req.param("id");

  if (!projectUserId) {
    throw new HTTPException(400, { message: "Invalid project user ID" });
  }

  const findProjectUser = await db.projectUser.findUnique({
    where: { id: projectUserId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          description: true,
          accessTTL: true,
          refreshTTL: true,
          singleSession: true,
        },
      },
      sessions: {
        select: {
          id: true,
          createdAt: true,
          revokedAt: true,
          accessExpiration: true,
          refreshExpiration: true,
          deviceInfo: true,
        },
      },
      verifications: {
        select: {
          id: true,
          code: true,
          createdAt: true,
          expiresAt: true,
          verifiedAt: true,
          isUsed: true,
        },
      },
      magicLinks: {
        select: {
          id: true,
          expiresAt: true,
          isUsed: true,
        },
      },
    },
  });

  if (!findProjectUser) {
    throw new HTTPException(404, { message: "Project user not found" });
  }

  return c.json({
    findProjectUser,
  });
};

// PUT /api/projectUsers/:id - update a projectUser
export const updateProjectUser = async (c: Context) => {
  const projectUserId = c.req.param("id");

  if (!projectUserId) {
    throw new HTTPException(400, { message: "Invalid project user ID" });
  }

  const body = await c.req.json();

  const existingProjectUser = await db.projectUser.findUnique({
    where: { id: projectUserId, email: body.email },
  });

  if (!existingProjectUser) {
    throw new HTTPException(400, { message: "Project user not found" });
  }

  if (body.projectId && body.projectId !== existingProjectUser.projectId) {
    const projectExists = await db.project.findUnique({
      where: { id: body.projectId },
    });

    if (!projectExists) {
      throw new HTTPException(400, { message: "Project not found" });
    }

    const projectHasUser = await db.projectUser.findFirst({
      where: { projectId: body.projectId, id: { not: projectUserId } },
    });

    if (projectHasUser) {
      throw new HTTPException(400, {
        message: "Project already has an existing user",
      });
    }
  }

  const updateData: any = {};
  if (body.email) updateData.email = body.email;
  if (body.hashPassword) updateData.hashPassword = body.hashPassword;
  if (body.metadata !== undefined) updateData.metadata = body.metadata;
  if (body.projectId !== undefined) updateData.projectId = body.projectId;

  const updatedProjectUser = await db.projectUser.update({
    where: { id: projectUserId },
    data: updateData,
    select: {
      id: true,
      email: true,
      metadata: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return c.json({
    message: "Project user successfully updated!",
    projectUser: updatedProjectUser,
  });
};

// DELETE /api/projectUsers/:id - delete a projectUser
export const deleteProjectUser = async (c: Context) => {
  const projectUserId = c.req.param("id");

  if (!projectUserId) {
    throw new HTTPException(400, { message: "Invalid project user ID" });
  }

  const existingProjectUser = await db.projectUser.findUnique({
    where: { id: projectUserId },
    include: {
      sessions: true,
      verifications: true,
      magicLinks: true,
    },
  });

  if (!existingProjectUser) {
    throw new HTTPException(400, { message: "Project user not found" });
  }

  await db.projectUser.delete({
    where: { id: projectUserId },
  });

  return c.json({
    message: "Project user successfully deleted!",
  });
};
