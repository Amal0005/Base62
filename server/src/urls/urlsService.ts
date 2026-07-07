import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUrlService } from './interfaces/IUrlService';
import type { IUrlRepository } from './interfaces/IUrlRepository';
import { Url } from './schemas/urlSchema';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

@Injectable()
export class UrlsService implements IUrlService {
  constructor(
    @Inject('IUrlRepository') private readonly urlsRepository: IUrlRepository
  ) {}

  async createShortUrl(originalUrl: string, userId: string): Promise<Url> {
    const shortId = nanoid(7);
    return this.urlsRepository.create({ 
      originalUrl, 
      shortId, 
      userId: new Types.ObjectId(userId) 
    });
  }

  async getOriginalUrl(shortId: string): Promise<Url> {
    try {
      const url = await this.urlsRepository.findOne({ shortId });
      return url;
    } catch (error) {
      throw new NotFoundException('Short URL not found');
    }
  }
}
