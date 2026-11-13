-- The developer role is merged into admin: admins now have global access and maintain the
-- global badge library. Existing developer accounts become admins before the value is dropped.
UPDATE "users" SET "role" = 'admin' WHERE "role" = 'developer';

-- Postgres cannot drop a value from an enum, so the type is recreated without it.
ALTER TYPE "Role" RENAME TO "Role_old";
CREATE TYPE "Role" AS ENUM ('admin', 'user', 'supervisor');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role" USING ("role"::text::"Role");
DROP TYPE "Role_old";
