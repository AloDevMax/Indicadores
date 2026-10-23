-- The developer role used to be derived from the e-mail at read time, so any case variant of that
-- e-mail got it. It is now stored like any other role. Only the exact lowercase e-mail is promoted.
UPDATE "users" SET "role" = 'developer' WHERE "email" = 'alo.de.castro@hotmail.com';

-- E-mails are stored in lowercase, so the existing unique index also rejects case variants.
-- If two accounts differ only by case, this update fails and they must be merged by hand first.
UPDATE "users" SET "email" = lower(trim("email")) WHERE "email" <> lower(trim("email"));
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase" CHECK ("email" = lower(trim("email")));
