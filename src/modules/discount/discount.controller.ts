import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { User } from 'src/decorators/user-infor.decorator';
import { get } from 'mongoose';
import { GetDiscountDto } from './dto/get-discount-amount.dto';
import { IShop } from '../shop/shop.interface';
import { Shop } from '../shop/schema/shop.schema';
import { Public } from 'src/decorators/public.decorator';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto, @User() shopId: string) {
    return this.discountService.createDiscount(createDiscountDto, shopId);
  }

  @Get()
  @Public()
  getAllDiscountCode(@Query("shopId") shopId:string, @Query('limit') limit: number, @Query('page') page: number) {
    return this.discountService.getAllDiscountCodeByShop(limit, page, shopId);
  }

  @Post("/amount")
  @Public()
  getDiscountAmount(@Query("shopId") shopId:string, @Body() getDiscountDto: GetDiscountDto) {
    return this.discountService.getDiscountAmount(getDiscountDto,  shopId);
  }

  @Get("/list_product_code")
  @Public()
  getAllDiscountWithProducts(@Query("shopId") shopId:string, @Query('limit') limit: number, @Query('page') page: number, @Query('code') code: string) {
    return this.discountService.getAllDiscountCodesWithProducts(code,  shopId, limit, page);
  }

  @Get("/shop")
  @Public()
  getAllDiscountCodesByShop(@Query("shopId") shopId:string, @Query('limit') limit: number, @Query('page') page: number){
    return this.discountService.getAllDiscountCodeByShop(limit, page, shopId);
  }


}
