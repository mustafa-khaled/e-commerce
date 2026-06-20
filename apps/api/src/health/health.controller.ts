import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get()
  async check() {
    const mongo = this.connection.readyState === 1 ? 'up' : 'down';
    let redis = 'unknown';
    try {
      await this.cache.set('health-check', 'ok', 1000);
      redis = 'up';
    } catch {
      redis = 'down';
    }
    return {
      status: mongo === 'up' ? 'ok' : 'degraded',
      checks: { mongo, redis },
    };
  }
}
