import { instance, mock, reset, verify, when } from 'ts-mockito';
import { TasksService } from './service/tasks.service';
import { TasksController } from './tasks.controller';
import { of } from 'rxjs';
import { UUID } from 'crypto';
import { AuthResponseDto } from '@shared/dtos/auth.dto';
import { User } from '@shared/entities/user.entity';
import { Task } from '@shared/entities/task.entity';

describe('TasksController', () => {
    let tasksController: TasksController;
    const tasksService: TasksService = mock(TasksService);

    beforeEach(() => {
        reset(tasksService);
        tasksController = new TasksController(instance(tasksService));
    });

    it('should be defined', () => {
        expect(tasksController).toBeDefined();
    });

    describe('listTasks', () => {
        it('should list all tasks for the authenticated user', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                email: '',
                username: '',
                iat: 0,
                exp: 1,
            };
            const userTask: User = {
                id: '1',
                fullname: 'Test User',
                email: 'test@gmail.com',
                pass: '12345',
                tasks: [],
            };
            const tasks: Task[] = [
                {
                    id: '1',
                    title: 'Test Task',
                    owner: userTask,
                    done: false,
                    description: 'Test',
                    dueDate: '01/01/2025',
                },
            ];
            when(tasksService.listTasks(user)).thenReturn(of(tasks));
            tasksController.listTasks(user).subscribe((response) => {
                expect(response).toEqual(tasks);
                verify(tasksService.listTasks(user)).once();
                done();
            });
        });
    });

    describe('getTask', () => {
        it('should get a specific task by ID', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                email: '',
                username: '',
                iat: 0,
                exp: 1,
            };
            const task: Task = {
                id: '1',
                title: 'Test Task',
                owner: { id: '1' } as User,
                done: false,
                description: 'Test',
                dueDate: '01/01/2025',
            };
            when(tasksService.getTask('1', user)).thenReturn(of(task));
            tasksController.getTask('1', user).subscribe((response) => {
                expect(response).toEqual(task);
                verify(tasksService.getTask('1', user)).once();
                done();
            });
        });
    });

    describe('createTask', () => {
        it('should create a new task for the authenticated user', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                email: '',
                username: '',
                iat: 0,
                exp: 1,
            };
            const createTaskDto = {
                title: 'New Task',
                description: 'Task Description',
                dueDate: '01/01/2025',
            };
            const newTask: Task = {
                id: '2',
                title: 'New Task',
                owner: { id: '1' } as User,
                done: false,
                description: 'Task Description',
                dueDate: '01/01/2025',
            };
            when(tasksService.createTask(createTaskDto, user)).thenReturn(
                of(newTask),
            );
            tasksController
                .createTask(createTaskDto, user)
                .subscribe((response) => {
                    expect(response).toEqual(newTask);
                    verify(tasksService.createTask(createTaskDto, user)).once();
                    done();
                });
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                email: '',
                username: '',
                iat: 0,
                exp: 1,
            };
            const editTaskDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03' as UUID,
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '02/02/2025',
            };
            const updatedTask: Task = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                title: 'Updated Task',
                owner: { id: '1' } as User,
                done: false,
                description: 'Updated Description',
                dueDate: '02/02/2025',
            };
            when(tasksService.editTask(editTaskDto, user)).thenReturn(
                of({ message: 'Task updated successfully' }),
            );
            tasksController
                .editTask(editTaskDto, user)
                .subscribe((response) => {
                    expect(response.message).toEqual(
                        'Task updated successfully',
                    );
                    verify(tasksService.editTask(editTaskDto, user)).once();
                    done();
                });
        });
    });

    describe('deleteTask', () => {
        it('should delete a task by ID', (done) => {
            const user: AuthResponseDto = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                email: '',
                username: '',
                iat: 0,
                exp: 1,
            };
            when(tasksService.deleteTask('1', user)).thenReturn(
                of({ message: 'Task deleted successfully' }),
            );
            tasksController.deleteTask('1', user).subscribe((response) => {
                expect(response).toEqual({
                    message: 'Task deleted successfully',
                });
                verify(tasksService.deleteTask('1', user)).once();
                done();
            });
        });
    });
});
