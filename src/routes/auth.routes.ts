import { Hono } from "hono";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  resetPassword,
  requestReset,
  forgotPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller";
import { zValidator } from "@hono/zod-validator";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  requestResetSchema,
  sendVerificationSchema,
} from "../schemas/auth.schema";
import { auth } from "../middlewares/auth.middleware";

const authRoutes = new Hono();

authRoutes.post("/register", zValidator("json", registerSchema), register);
authRoutes.post("/login", zValidator("json", loginSchema), login);
authRoutes.delete("/logout", logout);
authRoutes.get("/profile", auth, getProfile); // Get user information (fetch session with session id and include user)
authRoutes.put(
  "/profile",
  auth,
  zValidator("json", updateProfileSchema),
  updateProfile
); // Updates user information
authRoutes.post(
  "/reset-password",
  auth,
  zValidator("json", resetPasswordSchema),
  resetPassword
); // logged in (take current password and new password)
authRoutes.post(
  "/forgot-password",
  zValidator("json", requestResetSchema),
  requestReset
); // logged out (resets password with token)
authRoutes.post(
  "/forgot-password-reset",
  zValidator("json", forgotPasswordSchema),
  forgotPassword
);
authRoutes.post(
  "/send-verification",
  zValidator("json", sendVerificationSchema),
  sendVerificationEmail
); // Verify email for newly registered users with email link
authRoutes.get("/verify-email", verifyEmail);
authRoutes.post("/send-code"); // User must exist in database to send 6-digit code (numbers only) && Don't return code in request, only send. Create verification code in db
authRoutes.post("/verify-code");

export { authRoutes };
