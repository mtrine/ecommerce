import { Inject, Injectable } from "@nestjs/common";
import { ProductType } from "src/enums/product-type.enum";
import { Clothing } from "./schema/clothing.schema";
import { Electronics } from "./schema/electronic.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ClothingProduct } from "./clothing.base";
import { ElectronicsProduct } from "./electronics.base";
import { Product } from "./schema/product.schema";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepository } from "./product.repo";
import { BaseProduct } from "./product.base";
import {  UtilsService } from "src/utils/utils";
import { InventoriesRepository } from "../inventories/inventories.repo";

@Injectable()
export class ProductFactory {
    constructor(
        @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
        @InjectModel(Electronics.name) private electronicsModel: Model<Electronics>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        private productRepository: ProductRepository,
        @Inject(InventoriesRepository) private inventoryRepository: InventoriesRepository
    ) {}

    private getProductHandler(category: ProductType): BaseProduct {
        switch (category) {
            case ProductType.CLOTHING:
                return new ClothingProduct(this.clothingModel, this.productModel, this.productRepository, this.inventoryRepository);
            case ProductType.ELECTRONICS:
                return new ElectronicsProduct(this.electronicsModel, this.productModel, this.productRepository, this.inventoryRepository);
            default:
                throw new Error(`Unsupported product category: ${category}`);
        }
    }

    async createProduct(category: ProductType, createProductDto: CreateProductDto) {
        const productId = new Types.ObjectId().toString();

        const productHandler = this.getProductHandler(category);
        return await productHandler.createProduct(createProductDto, productId);
    }

    async updateProduct(category: ProductType, productId: string, updateProductDto: UpdateProductDto) {
        const objectAfterRemove = UtilsService.removeUndefinedAndNull(updateProductDto);
        const productHandler = this.getProductHandler(category);
        return await productHandler.updateProduct(productId, objectAfterRemove);
    }
}



