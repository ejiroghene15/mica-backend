import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ResourceRepository } from './entities/resource-repo';
import { QueryResourceDto } from './dto/query-resource.dto';
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { buildResponse } from '../common/utils/build-response.util';


@Injectable()
export class LibraryService {
    constructor(
    private readonly resourceRepo: ResourceRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(query: QueryResourceDto): Promise<IApiResponse> {
    const cacheKey = `library:list:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return buildResponse(true, 'Resources retrieved successfully', cached);
    }

    const result = await this.resourceRepo.findFiltered(query);
    await this.cache.set(cacheKey, result, 300_000); // 5 min

    return buildResponse(true, 'Resources retrieved successfully', result);
  }

  async findOne(slug: string): Promise<IApiResponse> {
    const cacheKey = `library:item:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return buildResponse(true, 'Resource retrieved successfully', cached);
    }

    const resource = await this.resourceRepo.findBySlug(slug);
    if (!resource) {
      throw new NotFoundException(`Resource with slug "${slug}" not found`);
    }

    await this.cache.set(cacheKey, resource, 300_000);

    return buildResponse(true, 'Resource retrieved successfully', resource);
  }
}

