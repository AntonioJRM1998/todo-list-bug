import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { User } from '@shared/entities/user.entity';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    public create(body: any): Observable<any> {
        const user = new User();
        user.email = body.email;
        user.pass = body.pass;
        user.fullname = body.fullname;

        return from(this.usersRepository.save(user)).pipe(
            map((savedUser) => {
                this.logger.log(`User created with ID: ${savedUser.id}`);
                return {
                    message: 'User created successfully',
                    user: savedUser,
                };
            }),
            catchError((error) => {
                this.logger.error('Error creating user', error);
                throw new BadRequestException('Could not create user');
            }),
        );
    }

    public findOne(email: string) {
        return from(
            this.usersRepository.findOneByOrFail({
                email,
            }),
        ).pipe(
            catchError((error) => {
                this.logger.error(
                    `Error finding user with email ${email}`,
                    error,
                );
                throw new NotFoundException('User not found');
            }),
        );
    }
}
