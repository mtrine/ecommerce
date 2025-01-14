import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Clothing } from "./schema/clothing.schema";
import { BaseProduct } from "./product.base";
import { CustomException } from "src/exception-handler/custom-exception";
import { ErrorCode } from "src/enums/error-code.enum";
import { Electronics } from "./schema/electronic.schema";
import { Product } from "./schema/product.schema";
import { ProductRepository } from "./product.repo";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UtilsService } from "src/utils/utils";
import { InventoriesRepository } from "../inventories/inventories.repo";
import { Inject } from "@nestjs/common";

export class ElectronicsProduct extends BaseProduct {

    constructor(

        @InjectModel(Electronics.name) private electronicsModel: Model<Electronics>,
        @InjectModel(Product.name) protected readonly productModel: Model<Product>,
        productRepository: ProductRepository,
        @Inject(InventoriesRepository) inventoryRepository: InventoriesRepository 

    ) {
        super(productModel, productRepository, inventoryRepository);
    }

    async createProduct(createProductDto: CreateProductDto) {
        const newElectronic = await this.electronicsModel.create({
            ...createProductDto.attributes,
            shop: createProductDto.shop
        });
        if (!newElectronic) {
            throw new CustomException(ErrorCode.ELECTRONIC_CREATE_FAILED);
        }
        const newProduct = await super.createProduct(createProductDto, newElectronic._id.toString());

        if (!newProduct) {
            await this.electronicsModel.findByIdAndDelete(newElectronic._id);
            throw new CustomException(ErrorCode.CREATE_PRODUCT_FAILED);
        }

        return newProduct;
    }

    async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
        if (updateProductDto.attributes) {
             await this.productRepository.updateProductById(productId, UtilsService.updateNestedObject(updateProductDto.attributes), this.electronicsModel);
        }

        const updatedProduct = await this.productModel.findByIdAndUpdate(productId, UtilsService.updateNestedObject(updateProductDto)
            , { new: true });

        if (!updatedProduct) {
            throw new CustomException(ErrorCode.UPDATE_PRODUCT_FAILED);
        }
        return updatedProduct;
    }
}
