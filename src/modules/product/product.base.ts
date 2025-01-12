import { CreateProductDto } from "./dto/create-product.dto";
import { Model } from "mongoose";
import { Product } from "./schema/product.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepository } from "./product.repo";

export class BaseProduct {
    constructor(
        @InjectModel(Product.name) protected readonly productModel: Model<Product>,
        protected productRepository: ProductRepository
    ) {

    }

    async createProduct(createProductDto: CreateProductDto) {
        const newProduct = await this.productModel.create(createProductDto);
        return newProduct;
    }

    async updateProduct(productId: string, updateProductDto: UpdateProductDto,) {
        return await this.productRepository.updateProductById(productId, updateProductDto, this.productModel);
    }
}
