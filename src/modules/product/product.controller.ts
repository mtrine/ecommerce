import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/decorators/user-infor.decorator';
import { IShop } from '../shop/shop.interface';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Create product successfully')
  create(@User() shop:IShop, @Body() createProductDto: CreateProductDto) {
    createProductDto.shop=shop._id;
    return this.productService.createProduct(createProductDto);
  }

  
}
