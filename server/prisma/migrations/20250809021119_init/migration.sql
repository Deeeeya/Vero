/*
  Warnings:

  - You are about to drop the column `accessExpires` on the `projectAuth` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `projectAuth` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projectAuth` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `projectAuth` table. All the data in the column will be lost.
  - You are about to drop the column `refreshExpires` on the `projectAuth` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `projectAuth` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `projectAuth` table. All the data in the column will be lost.
  - Added the required column `email` to the `projectAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `projectAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `projectAuth` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projectAuth" DROP CONSTRAINT "projectAuth_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projectAuth" DROP CONSTRAINT "projectAuth_userId_fkey";

-- DropIndex
DROP INDEX "projectAuth_accessToken_key";

-- DropIndex
DROP INDEX "projectAuth_refreshToken_key";

-- AlterTable
ALTER TABLE "VerificationTokens" ADD COLUMN     "projectAuthId" TEXT;

-- AlterTable
ALTER TABLE "projectAuth" DROP COLUMN "accessExpires",
DROP COLUMN "accessToken",
DROP COLUMN "createdAt",
DROP COLUMN "projectId",
DROP COLUMN "refreshExpires",
DROP COLUMN "refreshToken",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VerificationTokens" ADD CONSTRAINT "VerificationTokens_projectAuthId_fkey" FOREIGN KEY ("projectAuthId") REFERENCES "projectAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
