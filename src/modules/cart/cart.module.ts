import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { ProductModule } from '../product/product.module';
import { CartRepository } from './cart.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema
      }
    ]),
    ProductModule
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [
    CartRepository
  ]
})
export class CartModule { }
