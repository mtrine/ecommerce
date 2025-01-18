import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./schema/product.schema";
import { get, Model, SortOrder, Types } from "mongoose";
import { CustomException } from "src/exception-handler/custom-exception";
import { ErrorCode } from "src/enums/error-code.enum";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UtilsService } from "src/utils/utils";

export class ProductRepository {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) { }

   

    async publishProduct(productId: string, shopId: string) {
        const product = await this.productModel.findOne({
            shop: shopId,
            _id: productId,
        });

        if (!product) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        }

        product.isDraft = false;
        product.isPublic = true;
        const { modifiedCount } = await product.updateOne(product)
        return modifiedCount;
    }


    async unpublishProduct(productId: string, shopId: string) {
        const product = await this.productModel.findOne({
            shop: shopId,
            _id: productId,
        });

        if (!product) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        }

        product.isDraft = true;
        product.isPublic = false;
        const { modifiedCount } = await product.updateOne(product)
        return modifiedCount;
    }

    async queryProduct(query: any, limit: number, skip: number) {
        return await this.productModel.find(query)
            .populate('shop', 'email name -_id')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()
            .exec();
    }

    async searchProduct(keysearch: string, limit: number, skip: number) {
        const regexSearch = new RegExp(keysearch);
        const result = await this.productModel.find({
            $text: { $search: regexSearch.source }
        },
            { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .lean()

        return result;
    }

    async findAllProducts(limit: number, sort: string, page: number, filter: any, select: Array<string>) {
        console.log("filter"+JSON.stringify(filter));
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 as SortOrder } : { _id: 1 as SortOrder }
        const products = await this.productModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(UtilsService.getSelectData(select))
            .lean()
        return products;
    }

    async findProduct(id: string, unSelect: Array<string>) {
        return await this.productModel.findById(id)
            .select(UtilsService.unGetSelectData(unSelect))
            .lean();
    }

    async updateProductById(id: string, updateProductDto: UpdateProductDto, model: Model<any>) {
        return await model.findByIdAndUpdate(id,updateProductDto,{new:true});
    }

    async getProductsById(
        productId: string,
    ){
        return await this.productModel.findOne({
            _id: productId
        }).lean();
    }
}