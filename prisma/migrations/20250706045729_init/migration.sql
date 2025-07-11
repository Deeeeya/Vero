/*
  Warnings:

  - Made the column `userId` on table `verificationCodes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "verificationCodes" DROP CONSTRAINT "verificationCodes_userId_fkey";

-- AlterTable
ALTER TABLE "verificationCodes" ALTER COLUMN "isUsed" SET DEFAULT false,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "verificationCodes" ADD CONSTRAINT "verificationCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
