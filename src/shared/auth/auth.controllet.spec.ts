import { AuthDto } from '@shared/dtos/auth.dto';
import { mock, reset, instance, when } from 'ts-mockito';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { of } from 'rxjs';

describe('AuthController', () => {
    let authController: AuthController;
    const authService: AuthService = mock(AuthService);

    beforeEach(() => {
        reset(authService);
        authController = new AuthController(instance(authService));
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signIn', () => {
        it('should return access token for valid credentials', (done) => {
            const signInDto: AuthDto = {
                email: 'test@gmail.com',
                pass: 'testPass',
            };

            when(
                authService.signIn(signInDto.email, signInDto.pass),
            ).thenReturn(of({ access_token: 'mockedAccessToken' }));

            authController.signIn(signInDto).subscribe((response) => {
                expect(response).toEqual({ access_token: 'mockedAccessToken' });
                done();
            });
        });
    });
});
