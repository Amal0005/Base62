import { CreateUserDto } from '../Dto/userDTO';
import { User } from '../schemas/userSchema';

export interface IUserService {
  createUser(data: CreateUserDto): Promise<User>;
  getUser(email: string): Promise<User>;
  validateUser(email: string, pass: string): Promise<User | null>;
  saveOtp(email: string, otp: string, otpExpiry: Date): Promise<User>;
  clearOtp(email: string): Promise<User>;
  verifyUser(email: string): Promise<User>;
}
