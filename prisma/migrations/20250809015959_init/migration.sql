-- CreateTable
CREATE TABLE "projectAuth" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessExpires" TIMESTAMP(3) NOT NULL,
    "refreshExpires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projectAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projectAuth_accessToken_key" ON "projectAuth"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "projectAuth_refreshToken_key" ON "projectAuth"("refreshToken");

-- AddForeignKey
ALTER TABLE "projectAuth" ADD CONSTRAINT "projectAuth_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectAuth" ADD CONSTRAINT "projectAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "projectUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
