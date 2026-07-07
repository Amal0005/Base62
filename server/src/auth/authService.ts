import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './interfaces/IAuthService';
import type { IUserService } from '../users/interfaces/IUserService';
import { CreateUserDto } from '../users/Dto/userDTO';
import { User } from '../users/schemas/userSchema';

import { MailService } from '../mail/mailService';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './schemas/otpSchema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserService') private readonly usersService: IUserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    return this.usersService.validateUser(email, pass);
  }

  async login(user: User): Promise<{ access_token: string }> {
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }
    const payload = { email: user.email, sub: (user as any)._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(data);
    await this.requestOtp(user.email);
    return user;
  }

  async requestOtp(email: string): Promise<{ message: string }> {
    const user = await this.usersService.getUser(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.isVerified) {
      throw new UnauthorizedException('User is already verified');
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expires in 10 mins

    await this.otpModel.create({ email, otp, expiresAt });
    await this.mailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    const otpRecord = await this.otpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new UnauthorizedException('Please request an OTP first');
    }

    if (otpRecord.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }

    // OTP is valid, mark user as verified and delete OTP
    await this.usersService.verifyUser(email);
    await this.otpModel.deleteMany({ email });

    return { message: 'OTP verified successfully' };
  }
}
