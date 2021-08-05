-- CreateTable
CREATE TABLE "story" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "as_a" TEXT NOT NULL,
    "i_want" TEXT NOT NULL,
    "so_that" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "story.created_at_unique" ON "story"("created_at");

-- AlterIndex
ALTER INDEX "task_created_at_ix" RENAME TO "task.created_at_unique";
