import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";
import bcrypt from "bcrypt";
import { sendEmail } from "../lib/resend/client";

// POST /api/projectAuth - create new account
export const signUp = async (c: Context) => {
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

  const newUser = await db.projectUser.create({
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

export const refreshToken = async (c: Context) => {
  const body = await c.req.json();

  if (!body.refreshToken) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const session = await db.userSession.findFirst({
    where: {
      refreshToken: body.refreshToken,
      refreshExpiration: { gt: new Date() },
    },
  });

  if (!session) {
    throw new HTTPException(401, { message: "Invalid request" });
  }

  const newAccessToken = crypto.randomUUID();
  const newAccessExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const newSession = await db.userSession.update({
    where: { id: session.id },
    data: {
      accessToken: newAccessToken,
      accessExpiration: newAccessExpiration,
    },
    select: {
      accessToken: true,
      accessExpiration: true,
    },
  });

  return c.json({
    accessToken: newSession.accessToken,
  });
};

export const resetPassword = async (c: Context) => {
  const userId = c.get("userId");

  const body = await c.req.json();

  if (!body.oldPassword || !body.newPassword) {
    throw new HTTPException(401, {
      message: "Please enter your old and new password",
    });
  }

  const user = await db.projectUser.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HTTPException(400, { message: "Invalid access" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    body.oldPassword,
    user.hashPassword
  );

  if (!isPasswordCorrect) {
    throw new HTTPException(401, { message: "Incorrect password" });
  }

  if (body.newPassword != body.confirmNewPassword) {
    throw new HTTPException(401, { message: "Passwords do not match" });
  }

  const salt = 12;
  const newPassword = await bcrypt.hash(body.newPassword, salt);

  const updatedUser = await db.projectUser.update({
    where: { id: userId },
    data: {
      hashPassword: newPassword,
    },
    select: {
      id: true,
      email: true,
      metadata: true,
    },
  });

  if (!updatedUser) {
    throw new HTTPException(400, { message: "Bad Request" });
  }

  const revokedUser = await db.userSession.updateMany({
    where: { userId: userId },
    data: {
      revokedAt: new Date(Date.now()),
    },
  });

  return c.json({
    message: "Password reset successfully!",
  });
};

export const forgotPassword = async (c: Context) => {
  const body = await c.req.json();

  if (!body.email) {
    throw new HTTPException(400, { message: "Email is required" });
  }

  const user = await db.projectUser.findUnique({
    where: { email: body.email },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return c.json({
      message: "Email sent!",
    });
  }

  const resetToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  if (!process.env.FRONTEND_URL) {
    throw new HTTPException(500, { message: "Server error" });
  }

  const tokenRecord = await db.verificationTokens.create({
    data: {
      userId: user.id,
      email: body.email,
      token: resetToken,
      expiresAt: expiresAt,
      type: "password_reset",
    },
  });

  const sentEmail = await sendEmail.emails.send({
    from: "onboarding@resend.dev",
    to: body.email,
    subject: "Reset Your Password",
    html: `
        <div>
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the link below to create a new password:</p>
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p>Best regards,<br>The Vero Team</p>
        </div>
      `,
  });

  if (sentEmail.error) {
    throw new HTTPException(500, { message: "Failed to send email" });
  }

  return c.json({
    message: "Email sent!",
  });
};

export const resetForgottenPassword = async (c: Context) => {
  // get token and new password from request
  // find the reset token in verificationTokens
  /* 
    check token exists
    check if it is not expired
    check not already used
    check type is "password_reset"
  */
  // find the user associated with the token
  // hash the new password
  // update user's password in database
  // mark the token as used
  // OPTIONAL: revoke all user sessions (force re-login)
  // return success message
  const body = await c.req.json();

  const resetToken = await db.verificationTokens.findFirst({
    where: {
      token: body.token,
      expiresAt: { gt: new Date() },
      used: false,
      type: "password_reset",
    },
  });

  if (!resetToken) {
    throw new HTTPException(400, { message: "Invalid token" });
  }

  const user = await db.projectUser.findUnique({
    where: { email: resetToken.email },
  });

  if (!user) {
    throw new HTTPException(400, { message: "User not found" });
  }

  if (body.newPassword != body.confirmNewPassword) {
    throw new HTTPException(401, { message: "Passwords don't match" });
  }

  const salt = 12;
  const hashNewPassword = await bcrypt.hash(body.newPassword, salt);

  const updatedUser = await db.projectUser.update({
    where: { email: resetToken.email },
    data: {
      hashPassword: hashNewPassword,
    },
    select: {
      id: true,
      email: true,
      metadata: true,
    },
  });

  if (!updatedUser) {
    throw new HTTPException(400, { message: "Failed to update password" });
  }

  const updatedResetToken = await db.verificationTokens.update({
    where: { token: body.token },
    data: {
      used: true,
    },
  });
};
