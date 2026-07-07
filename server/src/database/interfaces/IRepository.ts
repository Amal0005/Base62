import { SaveOptions, UpdateQuery, ClientSession } from 'mongoose';

export interface IRepository<TDocument> {
  create(document: Omit<TDocument, '_id'>, options?: SaveOptions): Promise<TDocument>;
  findOne(filterQuery: Record<string, any>): Promise<TDocument>;
  findOneAndUpdate(
    filterQuery: Record<string, any>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument>;
  find(filterQuery: Record<string, any>): Promise<TDocument[]>;
  startTransaction(): Promise<ClientSession>;
}
