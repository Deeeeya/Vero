/*
  Warnings:

  - Added the required column `email` to the `VerificationTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerificationTokens" ADD COLUMN     "email" TEXT NOT NULL;
