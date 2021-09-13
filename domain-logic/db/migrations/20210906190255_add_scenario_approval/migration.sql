-- CreateTable
CREATE TABLE "scenario_approval" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scenario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scenario_approval.scenario_id_unique" ON "scenario_approval"("scenario_id");

-- AddForeignKey
ALTER TABLE "scenario_approval" ADD FOREIGN KEY ("scenario_id") REFERENCES "scenario"("id");
