import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
