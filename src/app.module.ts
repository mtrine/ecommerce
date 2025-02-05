import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchModule } from './modules/search/search.module';

import * as redisStore from 'cache-manager-redis-store';
import { ShopModule } from './modules/shop/shop.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { InventoriesModule } from './modules/inventories/inventories.module';
import { DiscountModule } from './modules/discount/discount.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { RedisModule } from './modules/redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot(
      { isGlobal: true, }
    ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 100,
    }),
    SearchModule,
    ShopModule,
    AuthModule,
    ProductModule,
    InventoriesModule,
    DiscountModule,
    CartModule,
    OrderModule,
    RedisModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
