/*
  Warnings:

  - You are about to drop the column `projectAuthId` on the `VerificationTokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VerificationTokens" DROP COLUMN "projectAuthId";
