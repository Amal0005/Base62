import { CreateUserDto } from '../../users/Dto/userDTO';
import { User } from '../../users/schemas/userSchema';

export interface IAuthService {
  validateUser(email: string, pass: string): Promise<User | null>;
  login(user: User): Promise<{ access_token: string; refresh_token: string }>;
  refreshToken(token: string): Promise<{ access_token: string }>;
  register(data: CreateUserDto): Promise<User>;
  requestOtp(email: string): Promise<{ message: string }>;
  verifyOtp(email: string, otp: string): Promise<{ message: string }>;
}
