-- CreateIndex
CREATE INDEX "users_productive_unit_id_idx" ON "users"("productive_unit_id");

-- CreateIndex
CREATE INDEX "auth_sessions_user_id_idx" ON "auth_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_badges_user_id_badge_id_idx" ON "user_badges"("user_id", "badge_id");

-- CreateIndex
CREATE INDEX "user_badges_badge_id_idx" ON "user_badges"("badge_id");

-- CreateIndex
CREATE INDEX "user_badges_awarded_at_idx" ON "user_badges"("awarded_at");

-- CreateIndex
CREATE INDEX "badge_submissions_user_id_idx" ON "badge_submissions"("user_id");

-- CreateIndex
CREATE INDEX "badge_submissions_badge_id_idx" ON "badge_submissions"("badge_id");

-- CreateIndex
CREATE INDEX "badge_submissions_status_idx" ON "badge_submissions"("status");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "import_run_rows_import_run_id_idx" ON "import_run_rows"("import_run_id");

