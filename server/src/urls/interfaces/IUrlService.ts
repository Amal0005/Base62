import { Url } from '../schemas/urlSchema';

export interface IUrlService {
  createShortUrl(originalUrl: string, userId: string): Promise<Url>;
  getOriginalUrl(shortId: string): Promise<Url>;
}
