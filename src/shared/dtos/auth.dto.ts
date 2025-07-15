import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { UUID } from 'crypto';

export class AuthDto {
    @ApiProperty({
        description: 'User email',
        example: 'testUser@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'StrongPassword123!',
    })
    @IsString()
    @IsNotEmpty()
    pass: string;
}

export class AuthResponseDto {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsNumber()
    id: UUID;

    @ApiProperty({
        description: 'User name',
        example: 'Test User',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'User email',
        example: 'testUser@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'JWT token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsNotEmpty()
    @IsNumber()
    iat: number;

    @ApiProperty({
        description: 'Token expiration time in seconds',
        example: 3600,
    })
    @IsNotEmpty()
    @IsNumber()
    exp: number;
}

export class CreateUserDto {
    @ApiProperty({
        description: 'User email',
        example: 'testUser@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'Test User',
    })
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        description: 'User password',
        example: 'StrongPassword123!',
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    @IsNotEmpty()
    pass: string;
}
