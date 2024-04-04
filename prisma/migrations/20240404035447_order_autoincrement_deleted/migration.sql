-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "tasks_order_seq";
