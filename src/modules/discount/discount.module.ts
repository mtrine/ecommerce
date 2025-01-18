import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { Discount, DiscountSchema } from './schema/discount.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '../product/product.module';
import { DiscountRepository } from './discount.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),
    ProductModule
  ],
  controllers: [DiscountController],
  providers: [DiscountService,DiscountRepository],
})
export class DiscountModule {}
