-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_paretnId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "paretnId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_paretnId_fkey" FOREIGN KEY ("paretnId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
