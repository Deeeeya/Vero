import { Hono } from "hono";
import { register, login, logout } from "../controllers/auth.controller";

const authRoutes = new Hono();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export { authRoutes };
