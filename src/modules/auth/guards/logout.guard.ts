import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { CacheInMemoryService } from "src/core/cache-in-memory/cache-in-memory.service";

@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(private readonly cacheInMemoryService: CacheInMemoryService) { }
  canActivate(context: ExecutionContext) {
    const token = context.switchToHttp().getRequest().headers.authorization?.split(' ')[1]
    if (this.cacheInMemoryService.cache.has(token)) {
      return false
    }
    return true
  }
}