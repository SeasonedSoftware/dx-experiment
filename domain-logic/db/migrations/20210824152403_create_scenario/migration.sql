-- CreateTable
CREATE TABLE "scenario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scenario.story_id_description_unique" ON "scenario"("story_id", "description");

-- AddForeignKey
ALTER TABLE "scenario" ADD FOREIGN KEY ("story_id") REFERENCES "story"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
