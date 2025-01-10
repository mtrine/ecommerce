import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Clothing } from "./schema/clothing.schema";
import { BaseProduct } from "./product.base";
import { CustomException } from "src/exception-handler/custom-exception";
import { ErrorCode } from "src/enums/error-code.enum";
import { Product } from "./schema/product.schema";

export class ClothingProduct extends BaseProduct {
    constructor(
        createProductDto: CreateProductDto,
        @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
        @InjectModel(Product.name) protected readonly productModel: Model<Product>,
    ) {
        super(createProductDto, productModel);
    }

    async createProduct() {
        const newClothing = await this.clothingModel.create({
            ...this.createProductDto.attributes,
            shop: this.createProductDto.shop
        });
        if (!newClothing) {
            throw new CustomException(ErrorCode.CLOTHING_CREATE_FAILED);
        }
        const newProduct = await this.productModel.create({
            _id: newClothing._id,
            name: this.createProductDto.name,
            type: this.createProductDto.type,
            description: this.createProductDto.description,
            price: this.createProductDto.price,
            thumb: this.createProductDto.thumb,
            quantity: this.createProductDto.quantity,
            shop: this.createProductDto.shop,
            attributes: newClothing

        })
        if (!newProduct) {
            throw new CustomException(ErrorCode.CREATE_PRODUCT_FAILED);
        }
        return newProduct;
    }
}
