import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dtos/auth.dto';
import { Observable } from 'rxjs';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    create(@Body() body: CreateUserDto): Observable<any> {
        this.logger.log('Creating user with data:', body);
        return this.usersService.create(body);
    }
}
