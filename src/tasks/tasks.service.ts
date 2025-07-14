import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Not, Repository } from 'typeorm';
import { get, isEmpty, isEqual, isNil } from 'lodash';
import { Logger } from '@nestjs/common';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { ICreateTask, IEditTask } from 'src/interface/tasks.interface';
import { User } from 'src/entities/user.entity';
import { fa } from '@faker-js/faker/.';
import { IAuthResponse } from 'src/interface/user.interface';

@Injectable()
export class TasksService {
    private readonly _logger = new Logger(TasksService.name);
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    public listTasks(user: IAuthResponse): Observable<Task[]> {
        if (isEmpty(user) || isNil(user)) {
            this._logger.error('User not authenticated');
            throw new UnauthorizedException('User not authenticated');
        }

        this._logger.log(`User ${user.email} is listing tasks`);

        return from(
            this.tasksRepository.find({
                where: {
                    owner: {
                        id: user.id,
                    },
                },
            }),
        ).pipe(
            catchError((error) => {
                this._logger.error('Error fetching tasks', error);
                throw new NotFoundException('Could not fetch tasks');
            }),
        );
    }

    public getTask(id: string, user: IAuthResponse): Observable<Task> {
        if (isEmpty(user) || isNil(user)) {
            this._logger.error('User not authenticated');
            throw new UnauthorizedException('User not authenticated');
        }

        this._logger.log(`User ${user.email} is getting task with id: ${id}`);

        return from(
            this.tasksRepository.findOne({
                where: {
                    id,
                    owner: { id: user.id },
                },
            }),
        ).pipe(
            map((task) => {
                if (!task) {
                    this._logger.warn(`Task with id ${id} not found`);
                    throw new ForbiddenException('Task not found');
                }
                return task;
            }),
            catchError((error) => {
                this._logger.error(`Error fetching task with id ${id}`, error);
                throw new NotFoundException('Could not fetch task');
            }),
        );
    }

    editTask(body: IEditTask, user: IAuthResponse) {
        return this.getTask(body.id, user).pipe(
            switchMap((existingTask) => {
                this._logger.log(
                    `Task with id ${body.id} found, proceeding to update`,
                );
                const isSameData = this.isTaskDataUnchanged(existingTask, body);
                if (isSameData) {
                    this._logger.warn(
                        `No changes detected for task with id ${body.id}`,
                    );
                    return of({ affected: 0 });
                }
                return this.tasksRepository.update(body.id, body);
            }),
            map((response) => {
                if (response.affected > 0) {
                    this._logger.log(
                        `Task with id ${body.id} updated successfully`,
                    );
                    return { message: 'Tarea actualizada correctamente' };
                } else {
                    this._logger.warn(
                        `No task found with id ${body.id} to update`,
                    );
                    return { message: 'No se actualizó ninguna tarea' };
                }
            }),
            catchError((error) => {
                this._logger.error(
                    `Error updating task with id ${body.id}`,
                    error,
                );
                throw new ForbiddenException('Error updating task');
            }),
        );
    }

    public createTask(
        body: ICreateTask,
        user: IAuthResponse,
    ): Observable<Task> {
        if (isEmpty(user) || isNil(user)) {
            this._logger.error('User not authenticated');
            throw new UnauthorizedException('User not authenticated');
        }

        this._logger.log(`User ${user.email} is creating a task`);

        const task = new Task();
        task.title = body.title;
        task.description = body.description;
        task.dueDate = body.dueDate;
        task.done = false; // Default value for new tasks
        task.owner = { id: user.id } as User;

        return from(this.tasksRepository.save(task)).pipe(
            map((savedTask) => {
                this._logger.log(
                    `Task created successfully with id: ${savedTask.id}`,
                );
                return savedTask;
            }),
            catchError((error) => {
                this._logger.error('Error creating task', error);
                throw new ForbiddenException('Could not create task');
            }),
        );
    }

    public deleteTask(id: string, user: IAuthResponse): Observable<any> {
        if (isEmpty(user) || isNil(user)) {
            this._logger.error('User not authenticated');
            throw new UnauthorizedException('User not authenticated');
        }

        this._logger.log(`User ${user.email} is deleting task with id: ${id}`);

        return from(
            this.tasksRepository.delete({
                id,
                owner: { id: user.id },
            }),
        ).pipe(
            map((result) => {
                if (result.affected === 0) {
                    throw new NotFoundException('Task not found');
                }
                this._logger.log(`Task with id ${id} deleted successfully`);
                return { message: 'Task deleted successfully' };
            }),
            catchError((error) => {
                this._logger.error(`Error deleting task with id ${id}`, error);
                throw new ForbiddenException('Could not delete task');
            }),
        );
    }

    private isTaskDataUnchanged(
        existingTask: Task,
        newData: Partial<Task>,
    ): boolean {
        const fieldsToCompare = ['title', 'description'];
        for (const field of fieldsToCompare) {
            if (!isEqual(existingTask[field], newData[field])) return false;
        }
        return true;
    }
}
