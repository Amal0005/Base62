import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './Dto/userDTO';
import type { IUserService } from './interfaces/IUserService';
import type { IUserRepository } from './interfaces/IUserRepository';
import { User } from './schemas/userSchema';

@Injectable()
export class UsersService implements IUserService {

  constructor(
    @Inject('IUserRepository') private readonly usersRepository: IUserRepository
  ) {}

 async createUser(data: CreateUserDto): Promise<User> {
  let existingUser: User | null = null;
  try {
    existingUser = await this.usersRepository.findOne({
      email: data.email,
    });
  } catch (error) {
    if (!(error instanceof NotFoundException)) {
      throw error;
    }
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  if (existingUser?.isVerified) {
    throw new ConflictException(
      'User with this email already exists',
    );
  }
  if (existingUser && !existingUser.isVerified) {
    return this.usersRepository.findOneAndUpdate(
      {
        email: data.email,
      },
      {
        password: hashedPassword,
      },
    );
  }
  return this.usersRepository.create({
    ...data,
    password: hashedPassword,
  });
}

  async getUser(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (user && await bcrypt.compare(pass, user.password)) {
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async saveOtp(email: string, otp: string, otpExpiry: Date): Promise<User> {
    return this.usersRepository.findOneAndUpdate(
      { email },
      { otp, otpExpiry }
    );
  }

  async clearOtp(email: string): Promise<User> {
    return this.usersRepository.findOneAndUpdate(
      { email },
      { $unset: { otp: 1, otpExpiry: 1 } } as any
    );
  }

  async verifyUser(email: string): Promise<User> {
    return this.usersRepository.findOneAndUpdate(
      { email },
      { isVerified: true } as any
    );
  }

}