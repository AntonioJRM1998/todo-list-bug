import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './service/users.service';
import { CreateUserDto } from '@shared/dtos/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 200, description: 'User created' })
    @HttpCode(HttpStatus.OK)
    @Post('/create')
    create(@Body() body: CreateUserDto): Observable<any> {
        this.logger.log('Creating user with data:', body);
        return this.usersService.create(body);
    }
}
