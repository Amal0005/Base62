import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlsService } from './urlsService';
import { UrlsController } from './urlsController';
import { UrlsRepository } from './urlsRepository';
import { Url, UrlSchema } from './schemas/urlSchema';
import { AuthModule } from '../auth/authModule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    AuthModule,
  ],
  controllers: [UrlsController],
  providers: [
    { provide: 'IUrlService', useClass: UrlsService },
    { provide: 'IUrlRepository', useClass: UrlsRepository },
  ],
  exports: ['IUrlService'],
})
export class UrlsModule {}
