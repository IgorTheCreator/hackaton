import { Inject, Injectable } from '@nestjs/common'
import { LRUCache } from 'lru-cache'

@Injectable()
export class CacheInMemoryService {
  constructor(@Inject('CACHE') readonly cache: LRUCache<{}, {}, unknown>) {}
}
