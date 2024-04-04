import { Tasks, status } from "@prisma/client";
import { TaskService } from "./task.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TaskCreateDto } from "./dtos";
import { TaskUpdateRequest } from "./interfaces";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('tasks')
@Controller({
    path: 'tasks',
    version: '1'
})
export class TaskController {
    readonly #_service: TaskService;

    constructor(taskService: TaskService) {
        this.#_service = taskService;
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all tasks' })
    async retrieveAllTasks(): Promise<Tasks[]> {
        return this.#_service.retrieveAllTasks();
    }

    @Get('/all')
    @ApiOperation({ summary: 'Retrieve all tasks with deleted' })
    async retrieveAllTasksWithDeleted(): Promise<Tasks[]> {
        return this.#_service.retrieveAllTasksWithDeleted();
    }

    @Get('/group-by-status')
    @ApiOperation({ summary: 'Group tasks by status' })
    async groupTasksByStatus(): Promise<any> {
        return this.#_service.groupTasksByStatus();
    }

    @Get('/search')
    @ApiOperation({ summary: 'Search tasks' })
    async searchTasks(@Query('q') query: string): Promise<Tasks[]> {
        return this.#_service.searchTasks(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve task by id' })
    async getTaskById(@Param('id') taskId: number): Promise<Tasks> {
        return this.#_service.getTaskById(+taskId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a task' })
    async createTask(
        @Body() payload: TaskCreateDto
    ): Promise<string> {
        return this.#_service.createTask(payload);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a task' })
    async updateTask(@Param('id') taskId: number, @Body() payload: TaskUpdateRequest): Promise<void> {
        this.#_service.updateTask(+taskId, payload);
    }

    @Delete(':id/soft')
    @ApiOperation({ summary: 'Soft delete a task' })
    async softDeleteTask(@Param('id') taskId: number): Promise<void> {
        this.#_service.softDeleteTask(+taskId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    async deleteTask(@Param('id') taskId: number): Promise<void> {
        return this.#_service.deleteTask(+taskId);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Change task status' })
    async changeTaskStatus(@Param('id') taskId: number, @Body('status') status: status): Promise<void> {
        return this.#_service.changeTaskStatus(+taskId, status);
    }

    @Patch(':id/order')
    @ApiOperation({ summary: 'Change task order' })
    async changeTaskOrder(@Param('id') taskId: number, @Body('order') order: number): Promise<void> {
        return this.#_service.changeTaskOrder(+taskId, order);
    }
}