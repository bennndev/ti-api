-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "position" VARCHAR(100),
ADD COLUMN     "specialtyId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
