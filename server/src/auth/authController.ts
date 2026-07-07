import { Controller, Inject, Post, Body, HttpCode, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { IAuthService } from './interfaces/IAuthService';
import { CreateUserDto } from '../users/Dto/userDTO';

@Controller('auth')
export class AuthController {
  constructor(@Inject('IAuthService') private readonly authService: IAuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-otp')
  async requestOtp(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.requestOtp(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    if (!body.email || !body.otp) {
      throw new BadRequestException('Email and OTP are required');
    }
    return this.authService.verifyOtp(body.email, body.otp);
  }
}
