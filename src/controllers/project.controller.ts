import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { db } from "../lib/db/client";
import { filterUndefined } from "../lib/utils";

// GET /api/projects - Get all projects
export const getProjects = async (c: Context) => {
  const userId = c.get("userId");
  const projects = await db.project.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      platform: true,
      accessTTL: true,
      refreshTTL: true,
      singleSession: true,
    },
    where: { userId: userId },
  });

  return c.json({
    projects,
    count: projects.length,
  });
};

// POST /api/projects/create-project - Create a new project
export const createProject = async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get("userId");

  const newProject = await db.project.create({
    data: {
      userId: userId,
      name: body.name,
      description: body.description || null,
      platform: body.platform || "all",
      accessTTL: body.accessTTL || 900,
      refreshTTL: body.refreshTTL || 43200,
      singleSession: body.singleSession || false,
    },
    select: {
      id: true,
    },
  });

  return c.json(
    {
      message: "Project created successfully!",
    },
    201
  );
};

// GET /api/projects/get-project:id - Get a specific project
export const getProject = async (c: Context) => {
  const projectId = c.req.param("id");
  const userId = c.get("userId");

  if (!projectId) {
    throw new HTTPException(400, { message: "Invalid project ID" });
  }

  const project = await db.project.findUnique({
    where: { id: projectId, userId: userId },
    include: {
      _count: {
        select: {
          users: true,
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
  const projectId = c.req.param("id");

  const userId = c.get("userId");

  if (!projectId) {
    throw new HTTPException(400, { message: "Invalid project ID" });
  }

  const existingProject = await db.project.findUnique({
    where: { id: projectId, userId: userId },
  });

  if (!existingProject) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  const body = await c.req.json();

  const updateData = filterUndefined(body);

  const updatedProject = await db.project.update({
    where: { id: projectId, userId: userId },
    data: updateData,
    select: {
      id: true,
    },
  });

  return c.json({
    message: "Project successfully updated!",
    project: updatedProject,
  });
};

// DELETE /api/projects/:id - Delete a project
export const deleteProject = async (c: Context) => {
  const projectId = c.req.param("id");
  const userId = c.get("userId");

  if (!projectId) {
    throw new HTTPException(400, { message: "Invalid project ID" });
  }

  const existingProject = await db.project.findUnique({
    where: { id: projectId, userId: userId },
  });

  if (!existingProject) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  await db.project.delete({
    where: { id: projectId, userId: userId },
  });

  return c.json({
    message: "Project successfully deleted!",
  });
};
