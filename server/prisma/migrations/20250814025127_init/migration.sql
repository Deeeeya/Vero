-- AlterTable
ALTER TABLE "VerificationTokens" ADD COLUMN     "projectUserId" TEXT;

-- AddForeignKey
ALTER TABLE "VerificationTokens" ADD CONSTRAINT "VerificationTokens_projectUserId_fkey" FOREIGN KEY ("projectUserId") REFERENCES "projectUsers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
