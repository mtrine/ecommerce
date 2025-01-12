import { Injectable } from "@nestjs/common";
import { ProductType } from "src/enums/product-type.enum";
import { Clothing } from "./schema/clothing.schema";
import { Electronics } from "./schema/electronic.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClothingProduct } from "./clothing.base";
import { ElectronicsProduct } from "./electronics.base";
import { Product } from "./schema/product.schema";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepository } from "./product.repo";
import { BaseProduct } from "./product.base";
import {  UtilsService } from "src/utils/utils";

@Injectable()
export class ProductFactory {
    constructor(
        @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
        @InjectModel(Electronics.name) private electronicsModel: Model<Electronics>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        private productRepository: ProductRepository
    ) {}

    private getProductHandler(category: ProductType): BaseProduct {
        switch (category) {
            case ProductType.CLOTHING:
                return new ClothingProduct(this.clothingModel, this.productModel, this.productRepository);
            case ProductType.ELECTRONICS:
                return new ElectronicsProduct(this.electronicsModel, this.productModel, this.productRepository);
            default:
                throw new Error(`Unsupported product category: ${category}`);
        }
    }

    async createProduct(category: ProductType, createProductDto: CreateProductDto) {
        const productHandler = this.getProductHandler(category);
        return await productHandler.createProduct(createProductDto);
    }

    async updateProduct(category: ProductType, productId: string, updateProductDto: UpdateProductDto) {
        const objectAfterRemove = UtilsService.removeUndefinedAndNull(updateProductDto);
        const productHandler = this.getProductHandler(category);
        return await productHandler.updateProduct(productId, objectAfterRemove);
    }
}



