import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { map, Observable, switchMap, from, catchError } from 'rxjs';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    public signIn(email: string, pass: string): Observable<any> {
        return this.usersService.findOne(email).pipe(
            switchMap((user) => {
                if (!user) {
                    this.logger.log(`User with email ${email} not found`);
                    throw new UnauthorizedException(
                        'Email or password is incorrect',
                    );
                }

                if (user.pass !== pass) {
                    this.logger.log(
                        `Invalid password for user with email ${email}`,
                    );
                    throw new UnauthorizedException(
                        'Email or password is incorrect',
                    );
                }

                const payload = { id: user.id, email: user.email };

                return from(
                    this.jwtService.signAsync(payload, {
                        expiresIn: '1h',
                    }),
                );
            }),
            map((access_token) => ({
                access_token,
            })),
            catchError((error) => {
                this.logger.error('Error during sign-in', error);
                throw new UnauthorizedException(error.message);
            }),
        );
    }
}
