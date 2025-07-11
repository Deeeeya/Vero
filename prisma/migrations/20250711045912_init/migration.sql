/*
  Warnings:

  - You are about to drop the column `ccreatedAt` on the `passwordReset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "passwordReset" DROP COLUMN "ccreatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
