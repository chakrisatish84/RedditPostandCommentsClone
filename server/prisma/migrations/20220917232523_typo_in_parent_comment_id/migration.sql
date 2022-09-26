/*
  Warnings:

  - You are about to drop the column `paretnId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_paretnId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "paretnId",
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
