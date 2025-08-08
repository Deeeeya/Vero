/*
  Warnings:

  - You are about to drop the column `enable` on the `projectUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projectUsers" DROP COLUMN "enable",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
