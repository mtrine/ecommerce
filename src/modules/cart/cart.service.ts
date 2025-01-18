import { Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';
import { CartState } from 'src/enums/cart-state.enum';
import { ProductRepository } from '../product/product.repo';
import { CustomException } from 'src/exception-handler/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productRepository: ProductRepository
  ) { }

  async create(addToCartDto: AddToCartDto) {
    const query = {
      userId: addToCartDto.userId,
      state: CartState.ACTIVE
    },
      updateOrInsert = {
        $addToSet: {
          products: addToCartDto.product
        }
      }, options = { upsert: true, new: true }

    return await this.cartModel.findOneAndUpdate(query, updateOrInsert, options).lean();
  }

  async updateUserCartQuantity(addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto.product
    const query = {
      userId: addToCartDto.userId,
      'products.productId': productId,
      state: CartState.ACTIVE
    }
      , updateOrInsert = {
        $inc: {
          'products.$.quantity': quantity
        }
      }, options = { upsert: true, new: true }

    return await this.cartModel.findOneAndUpdate(query, updateOrInsert, options).lean();
  }

  async addToCart(addToCartDto: AddToCartDto) {
    const userCart = await this.cartModel.findOne({
      userId: addToCartDto.userId,

    });

    if (!userCart) {
      return await this.create(addToCartDto);
    }

    if (!userCart.products.length) {
      userCart.products = [addToCartDto.product]
      return await userCart.save();
    }

    return await this.updateUserCartQuantity(addToCartDto);
  }

  async addToCartV2(updateCartDto: UpdateCartDto) {
    const { productId, quantity,  oldQuantity} = updateCartDto.itemProducts[0]
    const foundProduct = await this.productRepository.getProductsById(productId)

    if (!foundProduct) {
      throw new CustomException(ErrorCode.NOT_FOUND)
    }

    if (foundProduct.shop.toString() !== updateCartDto.itemProducts[0].shopId) {
      throw new CustomException(ErrorCode.PRODUCT_DO_NOT_BELONG_TO_SHOP)
    }

    if (quantity === 0) {
      return await this.deleteItemUserCart(updateCartDto.userId, productId)
    }

    return await this.updateUserCartQuantity({
      userId: updateCartDto.userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
        shopId: updateCartDto.itemProducts[0].shopId
      }
    });
  }

  async deleteItemUserCart(userId: string, productId: string) {
    const query = {
      userId,
      state: CartState.ACTIVE
    }, updateSet = {
      $pull: {
        products: {
          productId
        }
      }
    }, options = { upsert: true, new: true }

    const deleteCart = await this.cartModel.updateOne(query, updateSet)
    return deleteCart

  }

  async getListUserCart(userId: string) {
    return await this.cartModel.findOne({ userId, state: CartState.ACTIVE }).lean()
  }
}
