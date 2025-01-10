import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFactory } from './product.factory';

@Injectable()
export class ProductService {
  constructor(private readonly productFactory: ProductFactory) {}

  createProduct(createProductDto: CreateProductDto) {
    const { type } = createProductDto;

    const product = this.productFactory.createProduct(type, createProductDto);

    return product;
  }
}
