import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { InventoriesModule } from 'src/modules/inventories/inventories.module';

@Module({
  imports: [
    InventoriesModule
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
