import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
    @ApiProperty({
        description: 'Unique identifier for the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
    })
    @Column()
    fullname: string;

    @ApiProperty({
        description: 'Email of the user',
        example: '',
    })
    @Column()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'StrongPassword123!',
    })
    @Column()
    pass: string;

    @ApiProperty({
        description: 'List of tasks associated with the user',
        type: () => [Task],
    })
    @OneToMany(() => Task, (task) => task.owner)
    tasks: Task[];
}
