import { CreateProductDto } from "./dto/create-product.dto";
import { Model } from "mongoose";
import { Product } from "./schema/product.schema";
import { InjectModel } from "@nestjs/mongoose";

export class BaseProduct {
    constructor(
        protected readonly createProductDto: CreateProductDto,
        @InjectModel(Product.name) protected readonly productModel: Model<Product>

    ) {

    }

    async createProduct() {
        const newProduct = await this.productModel.create(this.createProductDto);
        return newProduct;
    }
}
