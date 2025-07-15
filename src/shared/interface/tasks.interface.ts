import { UUID } from 'crypto';

export interface ITask {
    id: UUID;
    title: string;
    description: string;
    done: boolean;
    dueDate: string;
    ownerId: string; // Assuming owner is a User, we can store the owner's ID
}

export interface ICreateTask {
    title: string;
    description: string;
    dueDate: string; // ISO date string
}

export interface IEditTask {
    id: string;
    title?: string; // Optional for partial updates
    description?: string; // Optional for partial updates
}
