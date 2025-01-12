import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { Clothing, ClothingSchema } from './schema/clothing.schema';
import { Electronics, ElectronicsSchema } from './schema/electronic.schema';
import { ProductFactory } from './product.factory';
import { ProductRepository } from './product.repo';
import { Shop, ShopSchema } from '../shop/schema/shop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name:Clothing.name,
        schema:ClothingSchema
      },
      {
        name: Electronics.name,
        schema: ElectronicsSchema,
      },
      {
        name:Shop.name,
        schema:ShopSchema
      }
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductFactory,ProductRepository],
})
export class ProductModule {}
