-- DropForeignKey
ALTER TABLE "VerificationTokens" DROP CONSTRAINT "VerificationTokens_userId_fkey";

-- AlterTable
ALTER TABLE "VerificationTokens" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VerificationTokens" ADD CONSTRAINT "VerificationTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
