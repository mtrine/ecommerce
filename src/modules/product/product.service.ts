import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repo';
import { Types } from 'mongoose';
import { ProductFactory } from './product.factory';
@Injectable()
export class ProductService {
  constructor(
    private readonly productFactory: ProductFactory,
    private readonly productRepository: ProductRepository,
  ) { }

  createProduct(createProductDto: CreateProductDto) {
    const { type } = createProductDto;

    const product = this.productFactory.createProduct(type, createProductDto);

    return product;
  }

  async findAllDraftsForShop(shopId: string, limit = 50, skip = 0) {
    const query = { shop: shopId, isDraft: true };
    return await this.productRepository.queryProduct(query, limit, skip);

  }

  async publishProduct(productId: string, shopId: string) {
    const shop = await this.productRepository.publishProduct(productId, shopId);
    return shop;
  }

  async unpublishProduct(productId: string, shopId: string) {
    const shop = await this.productRepository.unpublishProduct(productId, shopId);
    return shop;
  }

  async findAllPublicForShop(shopId: string, limit = 50, skip = 0) {
    const query = { shop: shopId, isPublic: true };
    return await this.productRepository.queryProduct(query, limit, skip);
  }

  async searchProduct(keysearch: string, limit = 50, skip = 0) {

    return await this.productRepository.searchProduct(keysearch, limit, skip);
  }

  async findAllProducts(limit: number = 50, page: number = 1, sort: string = 'ctime', filter: any = { isPublic: true }, select: string[] = ["name", "price", "description"]) {
    return await this.productRepository.findAllProducts(limit, sort, page, filter, select);
  }
  
  async findProductById(productId: string) {
    return await this.productRepository.findProduct(productId, ["__v"]);
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    const { type } = updateProductDto;

    const product = this.productFactory.updateProduct(type, productId, updateProductDto);

    return product
  }
}
