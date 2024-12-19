-- CreateTable
CREATE TABLE "tb_users" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "galxe_discord_id" TEXT NOT NULL,
    "galxe_twitter_id" TEXT NOT NULL,
    "galxe_email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_tasks" (
    "id" SERIAL NOT NULL,
    "task_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" TEXT NOT NULL,
    "completed_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "auth_user_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "tb_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_systems" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_systems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_username_key" ON "tb_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_auth_user_id_key" ON "tb_users"("auth_user_id");

-- CreateIndex
CREATE INDEX "tb_users_id_idx" ON "tb_users"("id");

-- CreateIndex
CREATE INDEX "tb_users_auth_user_id_idx" ON "tb_users"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_tasks_task_id_key" ON "tb_tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_tasks_auth_user_id_key" ON "tb_tasks"("auth_user_id");

-- CreateIndex
CREATE INDEX "tb_tasks_id_idx" ON "tb_tasks"("id");

-- CreateIndex
CREATE INDEX "tb_tasks_auth_user_id_idx" ON "tb_tasks"("auth_user_id");

-- CreateIndex
CREATE INDEX "tb_tasks_task_id_idx" ON "tb_tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_systems_system_id_key" ON "tb_systems"("system_id");

-- CreateIndex
CREATE INDEX "tb_systems_id_idx" ON "tb_systems"("id");

-- AddForeignKey
ALTER TABLE "tb_tasks" ADD CONSTRAINT "tb_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
