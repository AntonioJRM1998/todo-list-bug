import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class EditTask {
    @ApiPropertyOptional({
        description: 'Title of the task',
        example: 'Complete the project documentation',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        description: 'Description of the task',
        example: 'Write detailed documentation for the project',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'ID of the task to edit',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID()
    id: UUID;
}

export class CreateTask {
    @ApiProperty({
        description: 'Title of the task',
        example: 'Complete the project documentation',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Description of the task',
        example: 'Write detailed documentation for the project',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Due date of the task in ISO format',
        example: '2023-10-01T00:00:00Z',
    })
    @IsString()
    @IsNotEmpty()
    dueDate: string;
}
