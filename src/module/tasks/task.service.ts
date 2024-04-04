import type { Tasks, status } from "@prisma/client"
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { TaskCreateRequest, TaskUpdateRequest } from "./interfaces";


@Injectable()
export class TaskService {
    readonly #_prisma: PrismaService

    constructor(prisma: PrismaService) {
        this.#_prisma = prisma;
    }

    async retrieveAllTasks(): Promise<Tasks[]> {
        const tasks = await this.#_prisma.tasks.findMany({
            orderBy: {
                order: 'asc'
            },
            where: {
                deletedAt: null
            }
        });
        return tasks;
    }

    async retrieveAllTasksWithDeleted(): Promise<Tasks[]> {
        return await this.#_prisma.tasks.findMany();
    }

    async groupTasksByStatus(): Promise<any> {
        return await this.#_prisma.tasks.groupBy({
            by: ['status'],
            _count: true,
        });
    }

    async searchTasks(query: string): Promise<Tasks[]> {
        return await this.#_prisma.tasks.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
    }

    async getTaskById(taskId: number): Promise<Tasks> {
        await this.#_checkIfTaskNotExists(taskId);

        const task = await this.#_prisma.tasks.findUnique({ where: { id: taskId } });
        return task;
    }

    async createTask(payload: TaskCreateRequest): Promise<string> {
        let newOrder = payload.order;

        const isTaskOrderTaken = await this.#_prisma.tasks.findFirst({
            where: {
                order: payload.order
            }
        });

        if (isTaskOrderTaken || !payload.order) {
            const maxOrderTask = await this.#_prisma.tasks.findFirst({
                orderBy: {
                    order: 'desc'
                }
            });
            newOrder = maxOrderTask ? maxOrderTask.order + 1 : 1;
        }

        await this.#_prisma.tasks.create({
            data: {
                title: payload.title,
                description: payload.description,
                order: newOrder,
                estimate: payload.estimate
            }
        });

        return '';
    }


    async updateTask(taskId: number, payload: TaskUpdateRequest): Promise<void> {
        await this.#_checkIfTaskNotExists(taskId);
        const task = await this.getTaskById(taskId);

        await this.#_prisma.tasks.update({
            where: { id: taskId }, data: {
                title: payload.title || task.title,
                description: payload.description || task.description,
                order: payload.order || task.order,
                estimate: payload.estimate || task.estimate
            }
        });
    }

    async softDeleteTask(taskId: number): Promise<void> {
        await this.#_checkIfTaskNotExists(taskId);

        await this.#_prisma.tasks.update({ where: { id: taskId }, data: { deletedAt: new Date() } });
    }

    async deleteTask(taskId: number): Promise<void> {
        await this.#_checkIfTaskNotExists(taskId);

        await this.#_prisma.tasks.delete({ where: { id: taskId } });
    }

    async changeTaskStatus(taskId: number, status: status): Promise<void> {
        await this.#_checkIfTaskNotExists(taskId);

        await this.#_prisma.tasks.update({
            where: { id: taskId }, data: {
                status: status
            }
        });
    }

    async changeTaskOrder(taskId: number, order: number): Promise<void> {
        await this.#_checkIfTaskNotExists(taskId);

        await this.#_prisma.tasks.updateMany({
            where: { order: { gte: order } },
            data: { order: { increment: 1 } }
        });

        await this.#_prisma.tasks.update({
            where: { id: taskId }, data: {
                order: order
            }
        });
    }

    async #_checkIfTaskNotExists(id: number): Promise<void> {
        if (id) {
            const task = await this.#_prisma.tasks.findUnique({ where: { id, deletedAt: null } });
    
            if (!task) {
                throw new NotFoundException(`Task with id ${id} not found`);
            }
        }
    }
}
