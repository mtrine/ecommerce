import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Clothing } from "./schema/clothing.schema";
import { BaseProduct } from "./product.base";
import { CustomException } from "src/exception-handler/custom-exception";
import { ErrorCode } from "src/enums/error-code.enum";
import { Product } from "./schema/product.schema";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepository } from "./product.repo";
import { UtilsService } from "src/utils/utils";
import { Inject } from "@nestjs/common";
import { InventoriesRepository } from "../inventories/inventories.repo";
export class ClothingProduct extends BaseProduct {
    constructor(
        @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
        @InjectModel(Product.name) protected readonly productModel: Model<Product>,
        protected productRepository: ProductRepository,
        @Inject(InventoriesRepository) inventoryRepository: InventoriesRepository 

    ) {
        super(productModel, productRepository,inventoryRepository);
    }

    async createProduct(createProductDto: CreateProductDto) {
        const newClothing = await this.clothingModel.create({
            ...createProductDto.attributes,
            shop: createProductDto.shop
        });
        if (!newClothing) {
            throw new CustomException(ErrorCode.CLOTHING_CREATE_FAILED);
        }
        const newProduct = await this.productModel.create({
            _id: newClothing._id,
            name: createProductDto.name,
            type: createProductDto.type,
            description: createProductDto.description,
            price: createProductDto.price,
            thumb: createProductDto.thumb,
            quantity: createProductDto.quantity,
            shop: new Types.ObjectId(createProductDto.shop),
            attributes: createProductDto.attributes

        })
        if (!newProduct) {
            throw new CustomException(ErrorCode.CREATE_PRODUCT_FAILED);
        }
        return newProduct;
    }

    async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
        if (updateProductDto.attributes) {
            await this.productRepository.updateProductById(productId, UtilsService.updateNestedObject(updateProductDto.attributes), this.clothingModel);
        }
        const updatedProduct = await this.productModel.findByIdAndUpdate(productId,
            UtilsService.updateNestedObject(updateProductDto)
            , { new: true });
        if (!updatedProduct) {
            throw new CustomException(ErrorCode.UPDATE_PRODUCT_FAILED);
        }
        return updatedProduct;
    }
}
