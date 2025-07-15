import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { User } from '@shared/entities/user.entity';

describe('UserService', () => {
    let userService: UsersService;
    const usersRepository: Repository<User> = mock<Repository<User>>();

    beforeEach(() => {
        reset(usersRepository);
        userService = new UsersService(instance(usersRepository));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('create', () => {
        it('should create a user and return success message', (done) => {
            const createUserDto = {
                email: 'testuser@gmail.com',
                pass: 'testpass',
                fullname: 'Test User',
            };
            const savedUser = {
                id: 1,
                ...createUserDto,
            };

            when(usersRepository.save(anything())).thenResolve(
                savedUser as any,
            );
            userService.create(createUserDto).subscribe((response) => {
                expect(response).toEqual({
                    message: 'User created successfully',
                    user: savedUser,
                });
                verify(usersRepository.save(anything())).once();
                done();
            });
        });

        it('should throw BadRequestException on error', (done) => {
            const createUserDto = {
                email: 'testuser@gmail.com',
                pass: 'testpass',
                fullname: 'Test User',
            };
            when(usersRepository.save(anything())).thenReject(
                new Error('Database error'),
            );
            userService.create(createUserDto).subscribe({
                error: (error) => {
                    expect(error.message).toBe('Could not create user');
                    verify(usersRepository.save(anything())).once();
                    done();
                },
            });
        });
    });

    describe('findOne', () => {
        it('should find a user by email', (done) => {
            const email = 'test1@gmail.com';
            const foundUser = { id: 1, email };
            when(usersRepository.findOneByOrFail(anything())).thenResolve(
                foundUser as any,
            );
            userService.findOne(email).subscribe((user) => {
                expect(user).toEqual(foundUser);
                verify(usersRepository.findOneByOrFail(anything())).once();
                done();
            });
        });

        it('should throw NotFoundException if user not found', (done) => {
            const email = 'test1@gmail.com';
            when(usersRepository.findOneByOrFail(anything())).thenReject(
                new Error('User not found'),
            );
            userService.findOne(email).subscribe({
                error: (error) => {
                    expect(error.message).toBe('User not found');
                    verify(usersRepository.findOneByOrFail(anything())).once();
                    done();
                },
            });
        });
    });
});
