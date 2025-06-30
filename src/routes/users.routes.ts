import { Hono } from "hono";
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const userRoutes = new Hono();

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);
userRoutes.get("/:id", getUser);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export { userRoutes };
