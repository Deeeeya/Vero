import { Hono } from "hono";
import {
  getProjectUsers,
  createProjectUser,
  getProjectUser,
  updateProjectUser,
  deleteProjectUser,
} from "../controllers/projectUsers.controller";
import { auth } from "../middlewares/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import {
  createProjectUserSchema,
  toggleProjectUserSchema,
  updateProjectUserSchema,
} from "../schemas/projectUsers.schema";

const projectUserRoutes = new Hono();

projectUserRoutes.get("/", auth, getProjectUsers);
projectUserRoutes.post(
  "/",
  auth,
  zValidator("json", createProjectUserSchema),
  createProjectUser
);
projectUserRoutes.get("/:id", auth, getProjectUser);
projectUserRoutes.put(
  "/:id",
  auth,
  zValidator("json", updateProjectUserSchema),
  updateProjectUser
);
projectUserRoutes.delete("/:id", auth, deleteProjectUser);

projectUserRoutes.put(
  "/:id",
  auth,
  zValidator("json", toggleProjectUserSchema)
);

export { projectUserRoutes };
