-- Accounts created or reset by an admin must pick their own password on first login.
ALTER TABLE "users" ADD COLUMN "must_change_password" BOOLEAN NOT NULL DEFAULT false;
