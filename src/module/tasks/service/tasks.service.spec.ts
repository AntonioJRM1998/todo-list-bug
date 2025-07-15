import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { AuthResponseDto } from '@shared/dtos/auth.dto';
import { Task } from '@shared/entities/task.entity';
import { User } from '@shared/entities/user.entity';

describe('TasksService', () => {
    let tasksService: TasksService;
    const tasksRepository: Repository<Task> = mock(Repository);

    beforeEach(() => {
        reset(tasksRepository);
        tasksService = new TasksService(instance(tasksRepository));
    });

    it('should be defined', () => {
        expect(tasksService).toBeDefined();
    });

    describe('listTasks', () => {
        it('should return a list of tasks for the authenticated user', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };
            const tasks: Task[] = [
                {
                    id: '1',
                    title: 'Test Task',
                    owner: user as unknown as User,
                    done: false,
                    description: 'Test',
                    dueDate: '01/01/2025',
                },
            ];

            when(tasksRepository.find(anything())).thenResolve(tasks as any);
            tasksService.listTasks(user).subscribe((response) => {
                expect(response).toEqual(tasks);
                verify(tasksRepository.find(anything())).once();
                done();
            });
        });

        it('should throw UnauthorizedException if user is not authenticated', (done) => {
            const user: AuthResponseDto = null;

            expect(() => tasksService.listTasks(user)).toThrowError(
                'User not authenticated',
            );
            done();
        });

        it('should throw NotFoundException if there is an error fetching tasks', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };
            when(tasksRepository.find(anything())).thenReject(
                new Error('Database error'),
            );
            tasksService.listTasks(user).subscribe({
                error: (error) => {
                    expect(error.message).toBe('Could not fetch tasks');
                    verify(tasksRepository.find(anything())).once();
                    done();
                },
            });
        });
    });

    describe('getTask', () => {
        it('should return a specific task by ID for the authenticated user', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };

            const task: Task = {
                id: '1',
                title: 'Test Task',
                owner: user as unknown as User,
                done: false,
                description: 'Test',
                dueDate: '01/01/2025',
            };

            when(tasksRepository.findOne(anything())).thenResolve(task as any);
            tasksService.getTask(task.id, user).subscribe((response) => {
                expect(response).toEqual(task);
                verify(tasksRepository.findOne(anything())).once();
                done();
            });
        });

        it('should throw UnauthorizedException if user is not authenticated', (done) => {
            const user: AuthResponseDto = null;
            const taskId = '1';

            expect(() => tasksService.getTask(taskId, user)).toThrowError(
                'User not authenticated',
            );
            done();
        });

        it('should throw ForbiddenException if task is not found', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };
            const taskId = 'non-existent-id';

            when(tasksRepository.findOne(anything())).thenResolve(null);
            tasksService.getTask(taskId, user).subscribe({
                error: (error) => {
                    expect(error.message).toBe('Could not fetch task');
                    verify(tasksRepository.findOne(anything())).once();
                    done();
                },
            });
        });
    });

    describe('editTask', () => {
        it('should update a task and return success message', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };

            const existingTask: Task = {
                id: '1',
                title: 'Test Task',
                owner: user as unknown as User,
                done: false,
                description: 'Test',
                dueDate: '01/01/2025',
            };

            const editTaskDto = {
                id: '1',
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '02/02/2025',
            };

            when(tasksRepository.findOne(anything())).thenResolve(
                existingTask as any,
            );
            when(tasksRepository.update(anything(), anything())).thenResolve({
                affected: 1,
            } as any);

            tasksService.editTask(editTaskDto, user).subscribe((response) => {
                expect(response).toEqual({
                    message: 'Task updated successfully',
                });
                verify(tasksRepository.findOne(anything())).once();
                verify(tasksRepository.update(anything(), anything())).once();
                done();
            });
        });

        it('should throw UnauthorizedException if user is not authenticated', (done) => {
            const user: AuthResponseDto = null;
            const editTaskDto = {
                id: '1',
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '02/02/2025',
            };

            expect(() => tasksService.editTask(editTaskDto, user)).toThrowError(
                'User not authenticated',
            );
            done();
        });

        it('should throw ForbiddenException if task is not found', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };
            const editTaskDto = {
                id: 'non-existent-id',
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '02/02/2025',
            };

            when(tasksRepository.findOne(anything())).thenResolve(null);
            tasksService.editTask(editTaskDto, user).subscribe({
                error: (error) => {
                    expect(error.message).toBe('Error updating task');
                    verify(tasksRepository.findOne(anything())).once();
                    done();
                },
            });
        });
    });
    describe('createTask', () => {
        it('should create a task and return success message', (done) => {
            const createTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: '2025-01-01',
            };
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };
            const savedTask = {
                id: '1',
                ...createTaskDto,
                owner: user,
            };

            when(tasksRepository.save(anything())).thenResolve(
                savedTask as any,
            );
            tasksService
                .createTask(createTaskDto, user)
                .subscribe((response) => {
                    expect(response).toEqual(savedTask);
                    verify(tasksRepository.save(anything())).once();
                    done();
                });
        });

        it('should throw BadRequestException on error', (done) => {
            const createTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: '2025-01-01',
            };

            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };

            when(tasksRepository.save(anything())).thenReject(
                new Error('Database error'),
            );
            tasksService.createTask(createTaskDto, user).subscribe({
                error: (error) => {
                    expect(error.message).toBe('Could not create task');
                    verify(tasksRepository.save(anything())).once();
                    done();
                },
            });
        });
    });

    describe('deleteTask', () => {
        it('should delete a task and return success message', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };

            const taskId = '1';

            when(tasksRepository.delete(anything())).thenResolve({
                affected: 1,
            } as any);

            tasksService.deleteTask(taskId, user).subscribe((response) => {
                expect(response).toEqual({
                    message: 'Task deleted successfully',
                });
                verify(tasksRepository.delete(anything())).once();
                done();
            });
        });

        it('should throw UnauthorizedException if user is not authenticated', (done) => {
            const user: AuthResponseDto = null;
            const taskId = '1';

            expect(() => tasksService.deleteTask(taskId, user)).toThrowError(
                'User not authenticated',
            );
            done();
        });

        it('should throw NotFoundException if task is not found', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                username: 'Test User',
                email: 'test@gmail.com',
                iat: 0,
                exp: 1,
            };

            const taskId = 'non-existent-id';

            when(tasksRepository.delete(anything())).thenResolve({
                affected: 0,
            } as any);

            tasksService.deleteTask(taskId, user).subscribe({
                error: (error) => {
                    expect(error.message).toBe('Could not delete task');
                    verify(tasksRepository.delete(anything())).once();
                    done();
                },
            });
        });
    });
});
