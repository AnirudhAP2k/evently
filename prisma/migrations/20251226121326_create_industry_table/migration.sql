/*
  Warnings:

  - You are about to drop the column `industry` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `industryId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "industry",
ADD COLUMN     "industryId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Industry" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_label_key" ON "Industry"("label");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
