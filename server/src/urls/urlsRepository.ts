import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstractRepository';
import { Url } from './schemas/urlSchema';
import { IUrlRepository } from './interfaces/IUrlRepository';

@Injectable()
export class UrlsRepository extends AbstractRepository<Url> implements IUrlRepository {
  protected readonly logger = new Logger(UrlsRepository.name);

  constructor(
    @InjectModel(Url.name) urlModel: Model<Url>,
    @InjectConnection() connection: Connection,
  ) {
    super(urlModel, connection);
  }
}
