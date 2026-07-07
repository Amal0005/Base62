import { Logger, NotFoundException } from '@nestjs/common';
import {
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
} from 'mongoose';
import { AbstractDocument } from './abstractSchema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection?: Connection,
  ) {}

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: Record<string, any>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  }

  async findOneAndUpdate(
    filterQuery: Record<string, any>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  }

  async find(filterQuery: Record<string, any>): Promise<TDocument[]> {
    return this.model.find(filterQuery, {}, { lean: true }) as unknown as TDocument[];
  }

  async startTransaction() {
    if (!this.connection) {
      throw new Error('Connection is required to start a transaction');
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
