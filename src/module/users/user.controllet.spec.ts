import { instance, mock, reset, verify, when } from 'ts-mockito';
import { of } from 'rxjs';
import { CreateUserDto } from '@shared/dtos/auth.dto';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
    let usersController: UsersController;
    const usersService: UsersService = mock(UsersService);

    beforeEach(() => {
        reset(usersService);
        usersController = new UsersController(instance(usersService));
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });

    describe('create', () => {
        it('should call usersService.create with the correct parameters', (done) => {
            const createUserDto: CreateUserDto = {
                email: 'testuser',
                pass: 'testpass',
                fullname: 'Test User',
            };
            const result = of({ success: true });
            when(usersService.create(createUserDto)).thenReturn(result);

            usersController.create(createUserDto).subscribe((response) => {
                expect(response).toEqual({ success: true });
                verify(usersService.create(createUserDto)).once();
                done();
            });
        });
    });
});
