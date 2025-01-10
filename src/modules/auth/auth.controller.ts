import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateShopDto } from '../shop/dto/create-shop.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { IShop } from '../shop/shop.interface';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { User } from 'src/decorators/user-infor.decorator';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signUpShop')
  @Public()
  @ResponseMessage('Sign up successfully')
  async signUp(@Body() createShopDto: CreateShopDto,@Res({ passthrough: true })  response: Response) {
    const newShop=await this.authService.handleSignUpShop(createShopDto,response);
    return newShop;
  }

  @Post('signInShop')
  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage('Sign in successfully')
  async signIn(@User() shop: IShop, @Res({ passthrough: true })  response: Response) {
    return await this.authService.handleSignInShop(shop, response);
  }

  @Post('logoutShop')
  @ResponseMessage('Logout successfully')
  async logout(@User() shop: IShop, @Res({ passthrough: true })  response: Response) {
    return await this.authService.handleLogout(shop._id, response);
  }

  
}
