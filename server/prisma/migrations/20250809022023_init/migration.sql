/*
  Warnings:

  - You are about to drop the column `password` on the `projectAuth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `projectAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashPassword` to the `projectAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projectAuth" DROP COLUMN "password",
ADD COLUMN     "hashPassword" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projectAuth_email_key" ON "projectAuth"("email");

-- CreateIndex
CREATE INDEX "projectAuth_email_idx" ON "projectAuth"("email");
