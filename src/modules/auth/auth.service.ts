import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ShopService } from '../shop/shop.service';
import { CreateShopDto } from '../shop/dto/create-shop.dto';
import { CustomException } from 'src/exception-handler/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { Shop } from '../shop/schema/shop.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleShop } from 'src/enums/role-shop.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import e, { Response } from 'express';
const bcrypt = require('bcrypt');
import * as ms from 'ms';
import { IShop } from '../shop/shop.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.shopModel.findOne({ email: email }).lean();
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async handleSignUpShop(createShopDto: CreateShopDto,response: Response) {
    const holderShop = await this.shopModel.findOne({ email: createShopDto.email }).lean();
    if (holderShop) {
      throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
    }
  
    const passwordHash = await bcrypt.hash(createShopDto.password, 10);
  
    const newShop = await this.shopModel.create({
      email: createShopDto.email,
      password: passwordHash,
      name: createShopDto.name,
      address: createShopDto.address,
      role: [RoleShop.SHOP]
    });
  
    if (newShop) {
      const payload = {
        sub: "token register",
        iss: "from server",
        _id: newShop._id,
        name: newShop.name,
        email: newShop.email,
        role: newShop.role,
        address: newShop.address,
      };
  
      const new_refresh_token = this.generateRefreshToken(payload);
      await this.cacheManager.set(`refresh_token:${newShop._id}`, new_refresh_token);
      response.clearCookie("refresh_token")
      response.cookie('refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
        maxAge: +ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        sameSite: 'none'
      })
      // Return payload for interceptor to format
      return {
        access_token: this.jwtService.sign(payload),
        shop: {
          _id: newShop._id,
          name: newShop.name,
          email: newShop.email,
          role: newShop.role,
          address: newShop.address,
        },
        refresh_token: new_refresh_token,
      };
    }
  
    throw new BadRequestException('Failed to create shop');
  }
  

  async handleSignInShop(shop: IShop, response: Response) {

    const { _id, email, name, role, address } = shop;

    const payload = {
      sub: "token login",
      iss: "from server",
      _id: _id,
      name: name,
      email: email,
      role: role,
      address: address
    }

    const new_refresh_token = this.generateRefreshToken(payload)
    await this.cacheManager.set(`refresh_token:${_id}`, new_refresh_token)
    response.clearCookie("refresh_token")
    response.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
      maxAge: +ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      sameSite: 'none'
    })
    return {
      access_token: this.jwtService.sign(payload),
      shop: {
        _id: _id,
        name: name,
        email: email,
        role: role,
        address: address,
      }
    };

  }

  async handleRefreshToken(refreshToken: string, response: Response) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // Get user ID from token
      const shopId = decoded._id;

      // Retrieve refresh token from Redis
      const cachedToken = await this.cacheManager.get<string>(
        `refresh_token:${shopId}`,
      );

      if (!cachedToken || cachedToken !== refreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      const shop = await this.shopModel.findById(shopId).lean();
      if (!shop) {
        throw new BadRequestException('Shop not found');
      }

      const { _id, name, email, address, role } = shop;

      const newPayload = {
        sub: "token refresh",
        iss: "from server",
        _id,
        name,
        email,
        role,
        address,
      }

      const newRefreshToken = this.generateRefreshToken(newPayload);

      // Update refresh token in Redis
      await this.cacheManager.set(`refresh_token:${_id}`, newRefreshToken);

      response.clearCookie('refresh_token');
      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
        maxAge: +ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        sameSite: 'none',
      });

      return {
        access_token: this.jwtService.sign(newPayload),
        shop: {
          _id: _id,
          name: name,
          email: email,
          role: role,
          address: address,
        }
      };
    } catch (error) {
      console.error('HandleRefreshToken Error:', error);
      throw new BadRequestException('Invalid refresh token');
    }
  }

  generateRefreshToken(payload: any) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE')
    })
    return refresh_token
  }

  async handleLogout(shopId: string, response: Response) {
    try {
      // Xóa refresh token từ Redis
      await this.cacheManager.del(`refresh_token:${shopId}`);
  
      // Xóa cookie `refresh_token`
      response.clearCookie('refresh_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
        sameSite: 'none',
      });
  
      // Không cần trả dữ liệu, chỉ cần xác nhận logout thành công
    } catch (error) {
      console.error('Logout Error:', error);
      throw new BadRequestException('Logout failed');
    }
  }
  
}
