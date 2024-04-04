-- AlterTable
CREATE SEQUENCE tasks_order_seq;
ALTER TABLE "tasks" ALTER COLUMN "order" DROP NOT NULL,
ALTER COLUMN "order" SET DEFAULT nextval('tasks_order_seq');
ALTER SEQUENCE tasks_order_seq OWNED BY "tasks"."order";
