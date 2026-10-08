import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { ResourceRepository } from '../entities/resource-repo';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
    CacheModule.register(),
  ],
  controllers: [LibraryController],
  providers: [LibraryService,ResourceRepository],
})
export class LibraryModule {}