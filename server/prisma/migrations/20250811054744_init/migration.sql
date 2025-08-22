/*
  Warnings:

  - You are about to drop the `projectAuth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationTokens" DROP CONSTRAINT "VerificationTokens_projectAuthId_fkey";

-- DropTable
DROP TABLE "projectAuth";
