-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'InProgress';
