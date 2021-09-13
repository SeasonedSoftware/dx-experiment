-- CreateEnum
CREATE TYPE "story_state" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "story" ADD COLUMN     "state" "story_state" NOT NULL DEFAULT E'PENDING';
