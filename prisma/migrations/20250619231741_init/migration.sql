-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('web', 'mobile', 'desktop', 'all');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectUsers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "projectUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "platform" "Platform" NOT NULL DEFAULT 'all',
    "accessTTL" INTEGER NOT NULL DEFAULT 900,
    "refreshTTL" INTEGER NOT NULL DEFAULT 43200,
    "singleSession" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magicLinks" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL,
    "isExpired" BOOLEAN NOT NULL,
    "ipUsed" TEXT,

    CONSTRAINT "magicLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userSessions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3) NOT NULL,
    "accessExpiration" TIMESTAMP(3) NOT NULL,
    "refreshExpiration" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "deviceInfo" JSONB,

    CONSTRAINT "userSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationCodes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL,
    "userId" INTEGER,
    "projectUserId" INTEGER,

    CONSTRAINT "verificationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projectUsers_email_key" ON "projectUsers"("email");

-- CreateIndex
CREATE INDEX "projectUsers_email_idx" ON "projectUsers"("email");

-- CreateIndex
CREATE INDEX "magicLinks_token_idx" ON "magicLinks"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationCodes_code_key" ON "verificationCodes"("code");

-- AddForeignKey
ALTER TABLE "projectUsers" ADD CONSTRAINT "projectUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magicLinks" ADD CONSTRAINT "magicLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "projectUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSessions" ADD CONSTRAINT "userSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "projectUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificationCodes" ADD CONSTRAINT "verificationCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificationCodes" ADD CONSTRAINT "verificationCodes_projectUserId_fkey" FOREIGN KEY ("projectUserId") REFERENCES "projectUsers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
