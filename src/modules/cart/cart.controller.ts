import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get()
  getListCart(@Query("userId") userId: string) {
    return this.cartService.getListUserCart(userId);
  }

  @Post('update')
  updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.addToCartV2(updateCartDto);
  }

  @Delete()
  deleteCart(@Query("userId") userId: string,@Query("productId") productId: string) {
    return this.cartService.deleteItemUserCart(userId, productId);
  }
}
