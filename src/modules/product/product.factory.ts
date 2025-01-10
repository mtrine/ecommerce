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

@Injectable()
export class ProductFactory {

    constructor(
        @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
        @InjectModel(Electronics.name) private electronicsModel: Model<Electronics>,
        @InjectModel(Product.name) private productModel: Model<Product>
    ){

    }
  async createProduct(category: ProductType, createProductDto: CreateProductDto) {
    switch (category) {
      case ProductType.CLOTHING: {
        const clothing = new ClothingProduct(
            createProductDto,
            this.clothingModel,
            this.productModel
        ).createProduct();
        return clothing;
      }
      case ProductType.ELECTRONICS: {
        const electronics = new ElectronicsProduct(
            createProductDto,
            this.electronicsModel,
            this.productModel
        ).createProduct();
        return electronics;
      }
      default:
        throw new Error(`Unsupported product category: ${category}`);
    }
  }
}



