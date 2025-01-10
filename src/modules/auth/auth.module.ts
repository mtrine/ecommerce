import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ShopModule } from '../shop/shop.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from '../shop/schema/shop.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shop.name,
        schema: ShopSchema,
      },
    ]),
   PassportModule,
   JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secretOrPrivateKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: configService.get<string>('JWT_ACCESS_EXPIRE'),
      },
    }),
    inject: [ConfigService],
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
