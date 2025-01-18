import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { CustomException } from 'src/exception-handler/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from './schema/discount.schema';
import { Model } from 'mongoose';
import { DiscountAppliesTo } from 'src/enums/discount-applies-to.enum';
import { ProductService } from '../product/product.service';
import { DiscountRepository } from './discount.repo';
import { max } from 'class-validator';
import { GetDiscountDto } from './dto/get-discount-amount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    private readonly productService: ProductService,
    private readonly discountRepository: DiscountRepository
  ) { }
  async createDiscount(createDiscountDto: CreateDiscountDto, shopId: string) {
    if (new Date() > new Date(createDiscountDto.endDate) || new Date() < new Date(createDiscountDto.startDate)) {
      throw new CustomException(ErrorCode.DATE_INVALID);
    }

    if (new Date(createDiscountDto.endDate) <= new Date(createDiscountDto.startDate)) {
      throw new CustomException(ErrorCode.START_DATE_GREATER_THAN_END_DATE);
    }
    const foundDiscount = await this.discountModel.findOne({
      code: createDiscountDto.code,
      shopId: shopId
    }).lean();

    if (foundDiscount && foundDiscount.isActive) {
      throw new CustomException(ErrorCode.DISCOUNT_CODE_ALREADY_EXISTS);
    }

    const newDiscount = await this.discountModel.create({
      ...createDiscountDto,
      shopId: shopId,
    });
    return newDiscount;
  }

  async updateDiscount(id: string, updateDiscountDto: UpdateDiscountDto) {

  }

  async getAllDiscountCodesWithProducts(code: string, shopId: string, limit: number, page: number) {
    const foundDiscounts = await this.discountModel.findOne({
      code: code,
      shopId: shopId
    }).lean();

    if (!foundDiscounts || !foundDiscounts.isActive) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    const { appliesTo, products } = foundDiscounts;
    
    if (appliesTo === DiscountAppliesTo.ALL) {
      const product = await this.productService.findAllProducts(
        limit,
        page,
        'ctime',
        {
          isPublic: true,
          shop: shopId,
        },
        ['name']
      );
      console.log("all"+product);
      return product;
    }

    if (appliesTo === DiscountAppliesTo.SPECIFIC_PRODUCTS) {
      const product = await this.productService.findAllProducts(
        limit,
        page,
        'ctime',
        {
          isPublic: true,
          _id: { $in: products },
          shop: shopId,
        },
        ['name']
      );
      console.log("spec"+product);
      return product;
    }
  }

  async getAllDiscountCodeByShop(limit: number, page: number, shopId: string) {
    const discounts = await this.discountRepository.findAllDiscountUnSelect(
      limit,
      page,
      'ctime',
      {
        shopId: shopId,
        isActive: true
      },
      ['__v', 'shopId']
    );
    return discounts;
  }

  async getDiscountAmount(getDiscountAmountDto: GetDiscountDto, shopId: string) {
    const foundDiscount = await this.discountRepository.checkDiscountExists(
      {
        code: getDiscountAmountDto.code,
        shopId: shopId
      }
    )

    if (!foundDiscount) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    const {
      isActive,
      maxUses,
      minOrderValue,
      startDate,
      endDate,
      maxUsesPerUser,
      userUsed,
      type
    } = foundDiscount

    if (!isActive) throw new CustomException(ErrorCode.DISCOUNT_EXPIRED);
    if (!maxUses) throw new CustomException(ErrorCode.DISCOUNT_ARE_OUT);
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) throw new CustomException(ErrorCode.DISCOUNT_EXPIRED);

    let totalOrder = 0;
    if (minOrderValue > 0) {
      totalOrder = getDiscountAmountDto.products.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
      }, 0);

      if (totalOrder < minOrderValue) throw new CustomException(ErrorCode.MIN_ORDER_VALUE_NOT_REACHED);
      if (maxUsesPerUser > 0) {
        const userUsedDiscount = userUsed.find((user) => user === getDiscountAmountDto.userId);
        if (userUsedDiscount) throw new CustomException(ErrorCode.DISCOUNT_ARE_OUT);
      }

      const amount = type === 'fixed-amount' ? foundDiscount.value : (totalOrder * foundDiscount.value) / 100;
      return {
        totalOrder,
        amount,
        totalPrice: totalOrder - amount
      }
    }
  }

  async deleteDiscount(
    shopId: string,
    code: string
  ) {
    const deleted = await this.discountModel.findOneAndDelete({
      shopId: shopId,
      code: code
    })
    return deleted;
  }

  async cancelDiscount(code: string, shopId: string, userId: string) {
    const discount = await this.discountRepository.checkDiscountExists({
      code: code,
      shopId: shopId
    })

    if (!discount) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    const result = await this.discountModel.findByIdAndUpdate(discount._id, {
      $pull: {
        userUsed: userId
      },
      $inc: {
        maxUses: 1,
        usesCount: -1
      }
    })

    return result;
  }
}
