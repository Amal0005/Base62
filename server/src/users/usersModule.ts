import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './usersService';
import { UsersRepository } from './usersRepository';
import { User, UserSchema } from './schemas/userSchema';
import { UsersController } from './usersController';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    { provide: 'IUserService', useClass: UsersService },
    { provide: 'IUserRepository', useClass: UsersRepository },
  ],
  exports: ['IUserService'],
})
export class UsersModule {}
