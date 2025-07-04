import { Hono } from "hono";
import { register, login, logout } from "../controllers/auth.controller";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "../schemas/auth.schema";

const authRoutes = new Hono();

authRoutes.post("/register", register);
authRoutes.post("/login", zValidator("json", loginSchema), login);
authRoutes.delete("/logout", logout);
authRoutes.get("/me"); // Get user information (fetch session with session id and include user)
authRoutes.post("/reset-password"); // logged in (take current password and new password)
authRoutes.post("/forgot-password"); // logged out (resets password with token)
authRoutes.put("/me"); // Updates user information
authRoutes.post("/send-code");
authRoutes.post("/verify-code");

export { authRoutes };
