import { IRepository } from '../../database/interfaces/IRepository';
import { User } from '../schemas/userSchema';

export interface IUserRepository extends IRepository<User> {
}
