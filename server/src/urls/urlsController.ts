import { Controller, Inject, Post, Get, Body, Param, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import type { IUrlService } from './interfaces/IUrlService';
import { UrlsService } from './urlsService';
import { CreateUrlDto } from './Dto/urlDTO';
import { AuthGuard } from '../auth/authGuard';
import type { Request, Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(@Inject('IUrlService') private readonly urlsService: UrlsService) {}

  @UseGuards(AuthGuard)
  @Post('shorten')
  async shortenUrl(@Body() createUrlDto: CreateUrlDto, @Req() request: Request) {
    const userId = (request as any).user.sub;
    const url = await this.urlsService.createShortUrl(createUrlDto.originalUrl, userId);
    return {
      shortUrl: `http://localhost:3000/urls/${url.shortId}`,
      originalUrl: url.originalUrl
    };
  }

  @Get(':id')
  async redirect(@Param('id') id: string, @Res() res: Response) {
    const url = await this.urlsService.getOriginalUrl(id);
    return res.redirect(HttpStatus.FOUND, url.originalUrl);
  }
}
