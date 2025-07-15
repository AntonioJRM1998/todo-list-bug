import { JwtService } from '@nestjs/jwt';
import { anything, instance, mock, when } from 'ts-mockito';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '@shared/entities/user.entity';
import { UsersService } from '@module/users/service/users.service';

describe('AuthService', () => {
    let authService: AuthService;
    const usersService: UsersService = mock(UsersService);
    let jwtService: JwtService = mock(JwtService);

    beforeEach(() => {
        authService = new AuthService(
            instance(usersService),
            instance(jwtService),
        );
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signIn', () => {
        it('should return access token for valid credentials', (done) => {
            const email = 'testUser@gmail.com';
            const pass = 'testPass';
            const user: User = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                fullname: 'Test',
                email: 'test@gmail.com',
                pass: 'testPass',
                tasks: [],
            };
            when(usersService.findOne(email)).thenReturn(of(user));

            when(jwtService.signAsync(anything(), anything())).thenResolve(
                'mockedAccessToken',
            );
            authService.signIn(email, pass).subscribe((response) => {
                expect(response).toEqual({ access_token: 'mockedAccessToken' });
                done();
            });
        });

        it('should return access token for valid credentials and return error', (done) => {
            const email = 'testUser@gmail.com';
            const pass = 'testPass';
            const user: User = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                fullname: 'Test',
                email: 'test@gmail.com',
                pass: '1212121',
                tasks: [],
            };
            when(usersService.findOne(email)).thenReturn(of(user));

            authService.signIn(email, pass).subscribe({
                error: (error) => {
                    expect(error.message).toBe(
                        'Email or password is incorrect',
                    );
                    done();
                },
            });
        });

        it('sould throw UnauthorizedException for invalid credentials', (done) => {
            const email = 'test';
            const pass = 'wrongPass';
            when(usersService.findOne(email)).thenReturn(of(null));
            authService.signIn(email, pass).subscribe({
                error: (error) => {
                    expect(error.message).toBe(
                        'Email or password is incorrect',
                    );
                    done();
                },
            });
        });

        it('sould throw UnauthorizedException for invalid credentials', (done) => {
            const email = 'test@gmail.com';
            const user: User = {
                id: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                fullname: 'Test',
                email: 'test@gmail.com',
                pass: '1212121',
                tasks: [],
            };
            const pass = 'wrongPass';
            when(usersService.findOne(email)).thenReturn(of(user));
            authService.signIn(email, pass).subscribe({
                error: (error) => {
                    expect(error.message).toBe(
                        'Email or password is incorrect',
                    );
                    done();
                },
            });
        });
    });
});
