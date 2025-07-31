/*
  Warnings:

  - The primary key for the `VerificationTokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `magicLinks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projectUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userSessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `verificationCodes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "magicLinks" DROP CONSTRAINT "magicLinks_userId_fkey";

-- DropForeignKey
ALTER TABLE "projectUsers" DROP CONSTRAINT "projectUsers_projectId_fkey";

-- DropForeignKey
ALTER TABLE "userSessions" DROP CONSTRAINT "userSessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "verificationCodes" DROP CONSTRAINT "verificationCodes_projectUserId_fkey";

-- AlterTable
ALTER TABLE "VerificationTokens" DROP CONSTRAINT "VerificationTokens_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VerificationTokens_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VerificationTokens_id_seq";

-- AlterTable
ALTER TABLE "magicLinks" DROP CONSTRAINT "magicLinks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "magicLinks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "magicLinks_id_seq";

-- AlterTable
ALTER TABLE "projectUsers" DROP CONSTRAINT "projectUsers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "projectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "projectUsers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projectUsers_id_seq";

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projects_id_seq";

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "userSessions" DROP CONSTRAINT "userSessions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "userSessions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "userSessions_id_seq";

-- AlterTable
ALTER TABLE "verificationCodes" DROP CONSTRAINT "verificationCodes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "projectUserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "verificationCodes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "verificationCodes_id_seq";

-- AddForeignKey
ALTER TABLE "projectUsers" ADD CONSTRAINT "projectUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magicLinks" ADD CONSTRAINT "magicLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "projectUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSessions" ADD CONSTRAINT "userSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "projectUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificationCodes" ADD CONSTRAINT "verificationCodes_projectUserId_fkey" FOREIGN KEY ("projectUserId") REFERENCES "projectUsers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
