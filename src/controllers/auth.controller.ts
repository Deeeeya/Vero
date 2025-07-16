import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db/client";
import { sendEmail } from "../lib/resend/client";
import bcrypt from "bcrypt";

// POST /api/auth/register - Create a new account
export const register = async (c: Context) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    throw new HTTPException(400, {
      message: "Email and password is required",
    });
  }

  const existingUser = await db.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new HTTPException(400, {
      message: "User with this email already exists",
    });
  }
  const salt = 12;
  const hashPassword = await bcrypt.hash(body.password, salt);

  const newUser = await db.user.create({
    data: {
      email: body.email,
      hashPassword: hashPassword,
      metadata: body.metadata || {},
      emailVerified: false,
    },
    select: {
      id: true,
      email: true,
      metadata: true,
      emailVerified: true,
    },
  });

  return c.json(
    {
      message: "User registered. Please verify email",
      user: newUser,
    },
    201
  );
};

// POST /api/auth/login
export const login = async (c: Context) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    throw new HTTPException(400, { message: "Email and password required" });
  }

  const user = await db.user.findFirst({
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

  const session = await db.session.create({
    data: {
      userId: user.id,
      metadata: {
        loginTime: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    },
    select: {
      id: true,
      userId: true,
      createdAt: true,
      expiresAt: true,
      metadata: true,
    },
  });

  return c.json({
    message: "Login successful!",
    user: {
      id: user.id,
      email: user.email,
      metadata: user.metadata,
    },
    session: session,
  });
};

// POST /api/auth/logout
export const logout = async (c: Context) => {
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const sessionId = authorization.split(" ")[1];

  if (!sessionId) {
    throw new HTTPException(400, { message: "Session ID is required" });
  }

  const session = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new HTTPException(400, { message: "Session not found" });
  }

  await db.session.delete({
    where: { id: sessionId },
  });

  return c.json({
    message: "Logout successful!",
  });
};

// GET /api/auth/profile - Get user profile
export const getProfile = async (c: Context) => {
  const userId = c.get("userId");

  if (!userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const user = await db.user.findUnique({
    where: { id: parseInt(userId) },
    omit: { hashPassword: true },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return c.json({
    message: "Profile retrieved",
    user,
  });
};

// PUT /api/auth/profile - Update user profile

export const updateProfile = async (c: Context) => {
  const userId = parseInt(c.get("userId"));

  if (!userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const body = await c.req.json();

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      email: body.email,
    },
    select: {
      id: true,
      email: true,
      metadata: true,
    },
  });

  return c.json({
    message: "User has been updated",
    user: updatedUser,
  });
};

// POST /api/auth/reset-password
export const resetPassword = async (c: Context) => {
  const userId = parseInt(c.get("userId"));

  if (!userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const body = await c.req.json();

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      hashPassword: true,
    },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Invalid password" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    body.oldPassword,
    user.hashPassword
  );

  if (!isPasswordCorrect) {
    throw new HTTPException(401, { message: "Invalid password" });
  }

  if (body.newPassword !== body.confirmNewPassword) {
    throw new HTTPException(401, { message: "Passwords dont match" });
  }

  const salt = 12;
  const newPassword = await bcrypt.hash(body.newPassword, salt);

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      hashPassword: newPassword,
    },
  });

  return c.json({
    message: "Password has been updated",
  });
};

// POST /api/auth/forgot-password
export const requestReset = async (c: Context) => {
  // check if user with email exists (return success always to prevent email enumeration)
  // generate reset token
  // check if env exists (in FRONTEND_URL)
  // store reset token in database
  // send reset email
  const body = await c.req.json();

  const user = await db.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true },
  });

  if (!user) {
    return c.json({
      message: "Email has been sent",
    });
  }

  const resetToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  if (!process.env.FRONTEND_URL) {
    throw new HTTPException(500, { message: "Server error" });
  }

  const tokenRecord = await db.passwordReset.create({
    data: {
      email: body.email,
      token: resetToken,
      expiresAt: expiresAt,
      used: false,
    },
  });

  if (!tokenRecord) {
    throw new HTTPException(500, { message: "Invalid request" });
  }

  const sentEmail = await sendEmail.emails.send({
    from: "noreply@yourapp.com",
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
    message: "Email has been sent!",
  });
};

// POST /api/auth/forgot-password-reset
export const forgotPassword = async (c: Context) => {
  // find reset token (has to be valid)
  // find user associated with the token
  // validate password match
  // hash the new password
  // update user's password in database
  // mark reset token as used
  // OPTIONAL: invalidate all user sessions to force users to re-login
  const body = await c.req.json();

  const resetToken = await db.passwordReset.findFirst({
    where: {
      token: body.token,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetToken) {
    throw new HTTPException(400, { message: "Invalid token" });
  }

  const user = await db.user.findUnique({
    where: { email: resetToken.email },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new HTTPException(400, { message: "User not found" });
  }

  if (body.newPassword !== body.newConfirmPassword) {
    throw new HTTPException(400, { message: "Passwords don't match" });
  }

  const salt = 12;
  const hashNewPassword = await bcrypt.hash(body.newPassword, salt);

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      hashPassword: hashNewPassword,
    },
  });

  if (!updatedUser) {
    throw new HTTPException(500, { message: "Failed to update password" });
  }

  const usedToken = await db.passwordReset.update({
    where: { id: resetToken.id },
    data: {
      used: true,
    },
  });

  if (!usedToken) {
    throw new HTTPException(500, { message: "Server error" });
  }

  await db.session.findMany({
    where: { userId: user.id },
  });

  return c.json({
    message:
      "Password has been reset successfully. Please log in with your new password.",
  });
};

// POST /api/auth/send-verification
export const sendVerificationEmail = async (c: Context) => {
  // initialize body
  // check if user with this email exists
  // check if user is already verified
  // generate verification token
  // check if env variable exists
  // store verification token in database
  // send verificaiton email
  // check if email sending failed
  // return json if complete
  const body = await c.req.json();

  const user = await db.user.findUnique({
    where: { email: body.email },
    select: {
      id: true,
      email: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  if (user.emailVerified) {
    throw new HTTPException(400, {
      message: "Email has already been verified",
    });
  }

  const verificationToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 10000); // 24 hr

  if (!process.env.BACKEND_URL) {
    throw new HTTPException(500, { message: "Server error" });
  }

  const tokenRecord = await db.emailVerificationToken.create({
    data: {
      email: body.email,
      token: verificationToken,
      expiresAt: expiresAt,
      used: false,
    },
  });

  const emailResult = await sendEmail.emails.send({
    from: "noreply@yourapp.com",
    to: body.email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome! Please verify your email</h2>
        <p>Hello,</p>
        <p>Thank you for registering with our service. To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">
          ${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}
        </p>
        
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
  });

  if (emailResult.error) {
    throw new HTTPException(400, { message: "Failed to send email" });
  }

  return c.json({
    message: "Email has been sent",
  });
};

// POST /api/auth/verify-email
export const verifyEmail = async (c: Context) => {
  // get token from URL query parameter
  // find valid verification token
  // find user associated with this token
  // check if user is verified
  // update user as verified
  // mark verification token as used
  // return success HTML page (user sees this in their browser)
  const token = c.req.query("token");

  if (!token) {
    throw new HTTPException(400, { message: "Token not found" });
  }

  const verificationToken = await db.emailVerificationToken.findFirst({
    where: {
      token: token,
      expiresAt: { gt: new Date() },
      used: false,
    },
  });

  if (!verificationToken) {
    throw new HTTPException(400, { message: "Invalid token" });
  }

  const user = await db.user.findUnique({
    where: { email: verificationToken.email },
    select: {
      id: true,
      email: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new HTTPException(400, { message: "Invalid user" });
  }

  if (user.emailVerified) {
    return c.html(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #28a745;">Email Already Verified!</h2>
          <p>Your email address has already been verified.</p>
          <p>You can now log in to your account.</p>
        </body>
      </html>
    `);
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
    },
  });

  const usedToken = await db.emailVerificationToken.update({
    where: { id: verificationToken.id },
    data: { used: true },
  });

  if (!usedToken) {
    throw new HTTPException(400, { message: "Token error" });
  }

  return c.html(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #28a745;">Email Verified Successfully!</h2>
        <p>Thank you for verifying your email address.</p>
        <p>Your account is now fully activated and you can log in.</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:3001"}/login" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Go to Login
        </a>
      </body>
    </html>
  `);
};

// POST /api/auth/send-code
export const sendCode = async (c: Context) => {};

// POST /api/auth/verify-code
export const verifyCode = async (c: Context) => {};
