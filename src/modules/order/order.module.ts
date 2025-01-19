import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { RedisModule } from '../redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]), 
    CartModule,
    ProductModule,
    DiscountModule,
    RedisModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
