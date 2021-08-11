/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `story` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE story_position;

ALTER TABLE "story" ADD COLUMN     "position" DOUBLE PRECISION NOT NULL DEFAULT (nextval('story_position'::regclass))::double precision;

-- CreateIndex
CREATE UNIQUE INDEX "story.position_unique" ON "story"("position");
