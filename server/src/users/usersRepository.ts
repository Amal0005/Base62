import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstractRepository';
import { User } from './schemas/userSchema';
import { IUserRepository } from './interfaces/IUserRepository';

@Injectable()
export class UsersRepository extends AbstractRepository<User> implements IUserRepository {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
