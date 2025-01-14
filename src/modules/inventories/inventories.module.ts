import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schema/inventory.schema';
import { InventoriesRepository } from './inventories.repo';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema
      }
    ])
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService, InventoriesRepository],
  exports: [InventoriesRepository]
})
export class InventoriesModule {}
