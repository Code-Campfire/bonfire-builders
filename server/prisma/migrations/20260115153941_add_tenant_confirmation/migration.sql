-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'ISSUE_CONFIRMED';
ALTER TYPE "NotificationType" ADD VALUE 'ISSUE_DISPUTED';

-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "tenant_confirmation_date" TIMESTAMP(3),
ADD COLUMN     "tenant_confirmation_notes" TEXT,
ADD COLUMN     "tenant_confirmed" BOOLEAN;
