-- CreateTable
CREATE TABLE "story_ready" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "story_ready.story_id_unique" ON "story_ready"("story_id");

-- AddForeignKey
ALTER TABLE "story_ready" ADD FOREIGN KEY ("story_id") REFERENCES "story"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
