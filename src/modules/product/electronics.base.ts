import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Clothing } from "./schema/clothing.schema";
import { BaseProduct } from "./product.base";
import { CustomException } from "src/exception-handler/custom-exception";
import { ErrorCode } from "src/enums/error-code.enum";
import { Electronics } from "./schema/electronic.schema";
import { Product } from "./schema/product.schema";

export class ElectronicsProduct extends BaseProduct {

    constructor(
        createProductDto: CreateProductDto,
        @InjectModel(Electronics.name) private electronicsModel: Model<Electronics>,
        @InjectModel(Product.name) protected readonly productModel: Model<Product>,
    ) {
        super(createProductDto, productModel);
    }

    async createProduct() {
        const newElectronic = await this.electronicsModel.create({
            ...this.createProductDto.attributes,
            shop: this.createProductDto.shop
        });
        if (!newElectronic) {
            throw new CustomException(ErrorCode.ELECTRONIC_CREATE_FAILED);
        }
        console.log("thumb"+this.createProductDto.thumb)
        const newProduct = await this.productModel.create({
            _id: newElectronic._id,
            name: this.createProductDto.name,
            type: this.createProductDto.type,
            description: this.createProductDto.description,
            thumb: this.createProductDto.thumb,
            price: this.createProductDto.price,
            quantity: this.createProductDto.quantity,
            shop: this.createProductDto.shop,
            attributes: newElectronic

        })

        if (!newProduct) {
            throw new CustomException(ErrorCode.CREATE_PRODUCT_FAILED);
        }

        return newProduct;
    }
}
