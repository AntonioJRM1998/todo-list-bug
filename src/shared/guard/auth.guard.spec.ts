import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { anything, instance, mock, when } from 'ts-mockito';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/decorators/is-public.decorator';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    const mockJwtService: JwtService = mock(JwtService);
    const mockReflector: Reflector = mock(Reflector);
    const mockContext: any = {
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
        switchToHttp: () => ({
            getRequest: () => ({
                headers: {
                    authorization: 'Bearer mockedToken',
                },
                user: {
                    username: 'testUser',
                    sub: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                    iat: 0,
                    exp: 1,
                },
            }),
        }),
    };

    beforeEach(() => {
        authGuard = new AuthGuard(
            instance(mockJwtService),
            instance(mockReflector),
        );
    });

    it('should be defined', () => {
        expect(authGuard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should return true when is a PUBLIC KEY', async () => {
            when(
                mockReflector.getAllAndOverride<boolean>(
                    IS_PUBLIC_KEY,
                    anything(),
                ),
            ).thenReturn(true);
            const result = await authGuard.canActivate(mockContext);
            expect(result).toBe(true);
        });
        it('should return true if the request is authenticated', async () => {
            when(
                mockReflector.getAllAndOverride<boolean>(
                    IS_PUBLIC_KEY,
                    anything(),
                ),
            ).thenReturn(false);

            when(
                mockJwtService.verifyAsync(anything(), anything()),
            ).thenResolve({
                username: 'testUser',
                sub: '8df1f861-7f99-4f13-a2e3-2f9d6f1ebc03',
                iat: 0,
                exp: 1,
            });

            const result = await authGuard.canActivate(mockContext);
            expect(result).toBe(true);
        });

        it('should return error if the verifyAsync failed', async () => {
            when(
                mockReflector.getAllAndOverride<boolean>(
                    IS_PUBLIC_KEY,
                    anything(),
                ),
            ).thenReturn(false);

            when(mockJwtService.verifyAsync(anything(), anything())).thenReject(
                new Error('Token verification failed'),
            );

            authGuard.canActivate(mockContext).catch((error) => {
                expect(error).toBeInstanceOf(UnauthorizedException);
            });
        });
    });
});
