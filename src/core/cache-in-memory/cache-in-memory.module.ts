import { LRUCache } from 'lru-cache';
import { Global, Module } from '@nestjs/common';
import { CacheInMemoryService } from './cache-in-memory.service';

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE',
      useFactory: () => new LRUCache({ ttl: 3 * 60 * 60 * 1000, max: 500 })
    },
    CacheInMemoryService
  ],
  exports: [CacheInMemoryService]
})
export class CacheInMemoryModule { }
