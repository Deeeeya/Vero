import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { db } from "../lib/db/client";

// GET /api/projects - Get all projects
export const getProjects = async (c: Context) => {
  const projects = await db.project.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      platform: true,
      accessTTL: true,
      refreshTTL: true,
      singleSession: true,
      users: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return c.json({
    projects,
    count: projects.length,
  });
};

// POST /api/projects - Create a new project
export const createProject = async (c: Context) => {
  const body = await c.req.json();

  if (!body.name) {
    throw new HTTPException(400, { message: "Name is required" });
  }

  const newProject = await db.project.create({
    data: {
      name: body.name,
      description: body.description || null,
      platform: body.platform || "all",
      accessTTL: body.accessTTL || 900,
      refreshTTL: body.refreshTTL || 43200,
      singleSession: body.singleSession || false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      platform: true,
      accessTTL: true,
      refreshTTL: true,
      singleSession: true,
    },
  });

  return c.json(
    {
      message: "Project created successfully!",
      project: newProject,
    },
    201
  );
};

// GET /api/projects/:id - Get a specific project
export const getProject = async (c: Context) => {
  const projectId = parseInt(c.req.param("id"));

  if (isNaN(projectId)) {
    throw new HTTPException(400, { message: "Invalid project ID" });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          metadata: true,
          sessions: {
            select: {
              id: true,
              accessExpiration: true,
              refreshExpiration: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  return c.json({
    project,
  });
};

// PUT /api/projects/:id - Update a project
export const updateProject = async (c: Context) => {
  const projectId = parseInt(c.req.param("id"));

  if (isNaN(projectId)) {
    throw new HTTPException(400, { message: "Invalid project ID" });
  }

  const existingProject = await db.user.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  const body = await c.req.json();

  const updateData: any = {};
  if (body.name) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.platform) updateData.platform = body.platform;
  if (body.accessTTL) updateData.accessTTL = body.accessTTL;
  if (body.refreshTTL) updateData.refreshTTL = body.refreshTTL;
  if (body.singleSession !== undefined)
    updateData.singleSession = body.singleSession;

  const updatedProject = await db.project.update({
    where: { id: projectId },
    data: updateData,
    select: {
      id: true,
      description: true,
      platform: true,
      accessTTL: true,
      refreshTTL: true,
      singleSession: true,
    },
  });

  return c.json({
    message: "Project successfully updated!",
    project: updatedProject,
  });
};

// DELETE /api/projects/:id - Delete a project
export const deleteProject = async (c: Context) => {
  const projectId = parseInt(c.req.param("id"));

  if (isNaN(projectId)) {
    throw new HTTPException(400, { message: "Invalid project ID" });
  }

  const existingProject = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return c.json({
    message: "Project successfully deleted!",
  });
};
