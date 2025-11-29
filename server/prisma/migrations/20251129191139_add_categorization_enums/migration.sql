/*
  Warnings:

  - The `status` column on the `issues` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `category` on the `issues` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `issues` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TENANT', 'LANDLORD', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PLUMBING', 'ELECTRICAL', 'HVAC', 'STRUCTURAL', 'APPLIANCE', 'PEST_CONTROL', 'LOCKS_KEYS', 'FLOORING', 'WALLS_CEILING', 'WINDOWS_DOORS', 'LANDSCAPING', 'PARKING', 'OTHER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable (Safe migration for issues table)
-- Step 1: Add new columns (nullable for now)
ALTER TABLE "issues"
  ADD COLUMN "category_new" "Category",
  ADD COLUMN "priority_new" "Priority",
  ADD COLUMN "status_new" "Status" DEFAULT 'OPEN';

-- Step 2: Copy and transform data
UPDATE "issues" SET
  category_new = 
    CASE
      WHEN category IS NULL THEN NULL
      ELSE UPPER(category)::"Category"
    END,
  priority_new = 
    CASE
      WHEN priority IS NULL THEN NULL
      ELSE UPPER(priority)::"Priority"
    END,
  status_new = 
    CASE
      WHEN status IS NULL THEN NULL
      ELSE UPPER(status)::"Status"
    END;

-- Step 3: Set new columns to NOT NULL (if required)
ALTER TABLE "issues"
  ALTER COLUMN "category_new" SET NOT NULL,
  ALTER COLUMN "priority_new" SET NOT NULL,
  ALTER COLUMN "status_new" SET NOT NULL;

-- Step 4: Drop old columns
ALTER TABLE "issues"
  DROP COLUMN "category",
  DROP COLUMN "priority",
  DROP COLUMN "status";

-- Step 5: Rename new columns to original names
ALTER TABLE "issues"
  RENAME COLUMN "category_new" TO "category",
  RENAME COLUMN "priority_new" TO "priority",
  RENAME COLUMN "status_new" TO "status";

-- Retain other column changes
ALTER TABLE "issues"
  ALTER COLUMN "acknowledged_date" DROP NOT NULL,
  ALTER COLUMN "resolved_date" DROP NOT NULL,
  ALTER COLUMN "closed_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "is_read" SET DEFAULT false,
ALTER COLUMN "read_at" DROP NOT NULL,
ALTER COLUMN "sent_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable (Safe migration for users.role)
-- Step 1: Add new column (nullable for now)
ALTER TABLE "users"
  ADD COLUMN "role_new" "Role";

-- Step 2: Copy and transform data
UPDATE "users" SET
  role_new = 
    CASE
      WHEN role IS NULL THEN NULL
      ELSE UPPER(role)::"Role"
    END;

-- Step 3: Set new column to NOT NULL (if required)
ALTER TABLE "users"
  ALTER COLUMN "role_new" SET NOT NULL;

-- Step 4: Drop old column
ALTER TABLE "users"
  DROP COLUMN "role";

-- Step 5: Rename new column to original name
ALTER TABLE "users"
  RENAME COLUMN "role_new" TO "role";
-- CreateIndex
CREATE INDEX "issues_user_id_idx" ON "issues"("user_id");

-- CreateIndex
CREATE INDEX "issues_complex_id_idx" ON "issues"("complex_id");

-- CreateIndex
CREATE INDEX "issues_status_idx" ON "issues"("status");

-- CreateIndex
CREATE INDEX "issues_category_idx" ON "issues"("category");

-- CreateIndex
CREATE INDEX "issues_priority_idx" ON "issues"("priority");
