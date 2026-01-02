-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferences" JSONB NOT NULL DEFAULT '{"emailNotifications": true}',
ALTER COLUMN "building_name" DROP NOT NULL;
