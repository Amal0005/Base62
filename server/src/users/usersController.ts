import { Controller, Inject } from '@nestjs/common';
import type { IUserService } from './interfaces/IUserService';

@Controller('users')
export class UsersController {
  constructor(@Inject('IUserService') private readonly usersService: IUserService) {}
}
