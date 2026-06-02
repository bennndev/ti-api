-- AlterTable
ALTER TABLE "Group_Experience" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
