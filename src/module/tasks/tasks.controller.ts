import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Patch } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './service/tasks.service';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthResponseDto } from '@shared/dtos/auth.dto';
import { EditTask, CreateTask } from '@shared/dtos/tasks.dto';
import { Task } from '@shared/entities/task.entity';
import { AuthGuard } from '@shared/guard/auth.guard';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(AuthGuard)
export class TasksController {
    private readonly _logger = new Logger(TasksController.name);
    constructor(private readonly tasksService: TasksService) {}

    @ApiOperation({ summary: 'List all tasks for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
    @ApiBearerAuth()
    @Get('')
    @HttpCode(HttpStatus.OK)
    listTasks(@CurrentUser() user: AuthResponseDto): Observable<Task[]> {
        this._logger.log('Listing all tasks');
        return this.tasksService.listTasks(user);
    }

    @ApiOperation({ summary: 'Get a specific task by ID' })
    @ApiResponse({ status: 200, description: 'Task details', type: Task })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiBearerAuth()
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getTask(
        @Param('id') id: string,
        @CurrentUser() user: AuthResponseDto,
    ): Observable<Task> {
        this._logger.log(`Getting task with id: ${id}`);
        return this.tasksService.getTask(id, user);
    }

    @ApiOperation({ summary: 'Edit a task' })
    @ApiResponse({
        status: 200,
        description: 'Task updated successfully',
        type: UpdateResult,
    })
    @ApiBody({ type: EditTask })
    @ApiBearerAuth()
    @Patch('/edit')
    @HttpCode(HttpStatus.OK)
    editTask(
        @Body() body: EditTask,
        @CurrentUser() user: AuthResponseDto,
    ): Observable<{ message: string }> {
        this._logger.log('Editing task with data:', body);
        return this.tasksService.editTask(body, user);
    }

    @ApiOperation({ summary: 'Create a task' })
    @ApiResponse({
        status: 201,
        description: 'Task created successfully',
        type: Task,
    })
    @ApiBody({ type: CreateTask })
    @ApiBearerAuth()
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    createTask(
        @Body() body: CreateTask,
        @CurrentUser() user: AuthResponseDto,
    ): Observable<Task> {
        this._logger.log('Creating task with data:', body);
        return this.tasksService.createTask(body, user);
    }

    @ApiOperation({ summary: 'Delete a task' })
    @ApiResponse({
        status: 200,
        description: 'Task deleted successfully',
    })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    deleteTask(
        @Param('id') id: string,
        @CurrentUser() user: AuthResponseDto,
    ): Observable<{ message: string }> {
        this._logger.log(`Deleting task with id: ${id}`);
        return this.tasksService.deleteTask(id, user);
    }
}
