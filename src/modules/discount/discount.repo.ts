import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Discount } from "./schema/discount.schema";
import { Model, SortOrder } from "mongoose";
import { UtilsService } from "src/utils/utils";
import { CustomException } from "src/exception-handler/custom-exception";
import { ErrorCode } from "src/enums/error-code.enum";

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

    async updateDiscount(code: string, userId: string): Promise<Discount> {
        // Find the discount by its code
        const discount = await this.discountModel.findOne({ code });
        if (!discount) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        }

        // Validate if the discount is active
        if (!discount.isActive) {
            throw new CustomException(ErrorCode.THIS_DISCOUNT_IS_NO_LONGER_ACTIVE);
        }

        // Validate date range
        const currentDate = new Date();
        if (currentDate < discount.startDate || currentDate > discount.endDate) {
            throw new CustomException(ErrorCode.THIS_DISCOUNT_IS_NOT_VALID_AT_THIS_TIME)
        }

        // Check if max uses have been reached
        if (discount.usesCount >= discount.maxUses) {
            throw new CustomException(ErrorCode.THIS_DISCOUNT_HAS_REACHED_ITS_USAGE_LIMIT)
        }

        // Check if the user has exceeded their usage limit
        const userUsageCount = discount.userUsed.filter((user) => user === userId).length;
        if (userUsageCount >= discount.maxUsesPerUser) {
            throw new CustomException(ErrorCode.YOU_HAVE_REACHED_THE_USAGE_LIMIT_FOR_THIS_DISCOUNT);
        }

        // Update the discount usage details
        discount.usesCount += 1;
        discount.userUsed.push(userId);

        // Save the updated discount back to the database
        return await discount.save();
    }

    async updateManyDiscount(code: Array<string>, userId: string) {
        // Tìm các discount dựa trên danh sách mã code
        const discounts = await this.discountModel.find({ code: { $in: code } });
        if (!discounts || discounts.length === 0) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        }

        const currentDate = new Date();
        const bulkOperations = []; // Mảng chứa các thao tác cập nhật hàng loạt

        for (let i = 0; i < discounts.length; i++) {
            const discount = discounts[i];

            // Kiểm tra điều kiện hợp lệ của discount
            if (!discount.isActive) {
                throw new CustomException(ErrorCode.THIS_DISCOUNT_IS_NO_LONGER_ACTIVE);
            }

            if (currentDate < discount.startDate || currentDate > discount.endDate) {
                throw new CustomException(ErrorCode.THIS_DISCOUNT_IS_NOT_VALID_AT_THIS_TIME);
            }

            if (discount.usesCount >= discount.maxUses) {
                throw new CustomException(ErrorCode.THIS_DISCOUNT_HAS_REACHED_ITS_USAGE_LIMIT);
            }

            const userUsageCount = discount.userUsed.filter((user) => user === userId).length;
            if (userUsageCount >= discount.maxUsesPerUser) {
                throw new CustomException(ErrorCode.YOU_HAVE_REACHED_THE_USAGE_LIMIT_FOR_THIS_DISCOUNT);
            }

            // Cập nhật thông tin discount
            discount.usesCount += 1;
            discount.userUsed.push(userId);

            // Thêm thao tác cập nhật vào mảng bulkOperations
            bulkOperations.push({
                updateOne: {
                    filter: { _id: discount._id },
                    update: {
                        $set: {
                            usesCount: discount.usesCount,
                            userUsed: discount.userUsed,
                        },
                    },
                },
            });
        }

        // Thực hiện cập nhật hàng loạt
        if (bulkOperations.length > 0) {
            await this.discountModel.bulkWrite(bulkOperations);
        }

        return { message: 'Discounts updated successfully' };
    }

}