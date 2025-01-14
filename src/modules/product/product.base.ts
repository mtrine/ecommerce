import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { ProductRepository } from './product.repo';
import { InventoriesRepository } from '../inventories/inventories.repo';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class BaseProduct {
    constructor(
        @InjectModel(Product.name) protected readonly productModel: Model<Product>,
        protected productRepository: ProductRepository,
        @Inject(InventoriesRepository) protected readonly inventoryRepository: InventoriesRepository // Inject trực tiếp
    ) {}

    async createProduct(createProductDto: CreateProductDto, productId: string) {
        if (!this.inventoryRepository) {
            throw new Error('inventoryRepository is not defined');
        }

        const newProduct = await this.productModel.create({
            ...createProductDto,
            _id: productId
        });

        if (newProduct) {
            await this.inventoryRepository.insertInventory({
                productId: productId,
                stock: createProductDto.quantity,
                shopId: createProductDto.shop,
                location: 'unknown'
            });
            return newProduct;
        }
    }

    async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
        return await this.productRepository.updateProductById(productId, updateProductDto, this.productModel);
    }
}
