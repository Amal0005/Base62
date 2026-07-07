import { IRepository } from '../../database/interfaces/IRepository';
import { Url } from '../schemas/urlSchema';

export interface IUrlRepository extends IRepository<Url> {
}
