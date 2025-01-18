import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Discount } from "./schema/discount.schema";
import { Model, SortOrder } from "mongoose";
import { UtilsService } from "src/utils/utils";

@Injectable()
export class DiscountRepository {
    constructor(
        @InjectModel(Discount.name) private discountModel: Model<Discount>,
    ) { }

    async findAllDiscountUnSelect(limit: number = 50, page: number = 1, sort = 'ctime', filter: any, unSelect: string[] = []) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 as SortOrder } : { _id: 1 as SortOrder }
        const products = await this.discountModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(UtilsService.unGetSelectData(unSelect))
            .lean()
        return products;
    }

    async findAllDiscountSelect(limit: number = 50, page: number = 1, sort = 'ctime', filter: any, select: string[] = []) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 as SortOrder } : { _id: 1 as SortOrder }
        const products = await this.discountModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(UtilsService.getSelectData(select))
            .lean()
        return products;
    }

    async checkDiscountExists(filter: any) {
        const foundDiscount = await this.discountModel.findOne(filter).lean();
        return foundDiscount;
    }
}