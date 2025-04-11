import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/shared/decorators';
import { IPayload } from 'src/shared/interfaces';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get("profile")
    profile(@User() user: IPayload) {
        return this.userService.profile(user)
    }
}
