-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastUpdateById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_lastUpdateById_fkey" FOREIGN KEY ("lastUpdateById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
