import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/decorators/user-infor.decorator';
import { IShop } from '../shop/shop.interface';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ResponseMessage('Create product successfully')
  create(@User() shop: IShop, @Body() createProductDto: CreateProductDto) {
    createProductDto.shop = shop._id;
    return this.productService.createProduct(createProductDto);
  }

  @Get("/drafts/all")
  @ResponseMessage('Get all drafts successfully')
  async getAllDrafts(@User() shop: IShop, @Query() limit: number, @Query() skip: number) {
    return await this.productService.findAllDraftsForShop(shop._id, limit, skip);
  }

  @Get("/public/all")
  @ResponseMessage('Get all public products successfully')
  async getAllPublic(@User() shop: IShop, @Query() limit: number, @Query() skip: number) {
    return await this.productService.findAllPublicForShop(shop._id, limit, skip);
  }

  @Put("/unpublish/:id")
  @ResponseMessage('Unpublish product successfully')
  async unpublishProduct(@User() shop: IShop, @Param('id') id: string) {
    return await this.productService.unpublishProduct(id, shop._id);
  }

  @Put("/publish/:id")
  @ResponseMessage('Publish product successfully')
  async publishProduct(@User() shop: IShop, @Param('id') id: string) {
    return await this.productService.publishProduct(id, shop._id);
  }

  @Get("/search/:keySearch")
  @ResponseMessage('Search product successfully')
  async searchProduct(@Param('keySearch') keysearch: string, @Query() limit: number, @Query() skip: number) {
    return await this.productService.searchProduct(keysearch, limit, skip);
  }

  @Get()
  @ResponseMessage('Get all products successfully')
  async getAllProducts(@Query() limit: number, @Query() page: number, @Query() sort: string, @Query() filter: any) {
    return await this.productService.findAllProducts(limit, page, sort, filter);
  }

  @Get(':id')
  @ResponseMessage('Get product by id successfully')
  async getProductById(@Param('id') id: string) {
    return await this.productService.findProductById(id);
  }

  @Patch(':id')
  @ResponseMessage('Update product successfully')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateProduct(id, updateProductDto);
  }
}
