import { Injectable } from '@nestjs/common';
import { CreateOrderDto, ShopOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartRepository } from '../cart/cart.repo';
import { CustomException } from 'src/exception-handler/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { ProductService } from '../product/product.service';
import { ProductRepository } from '../product/product.repo';
import { DiscountService } from '../discount/discount.service';
import { RedisService } from '../redis/redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateNewOrderDto } from './dto/create-new-order.dto';
import { DiscountRepository } from '../discount/discount.repo';


@Injectable()
export class OrderService {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository,
    private discountService: DiscountService,
    private redisService: RedisService,
    private discountRepository: DiscountRepository,
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) { }

  async checkoutReview(createOrderDto: CreateOrderDto) {
    const foundCart = await this.cartRepository.findById(createOrderDto.cartId);

    if (!foundCart) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    const checkoutOrder = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    }, shopOrderNew = []

    for (let i = 0; i < createOrderDto.shopOrders.length; i++) {
      const { shopId, shopDiscount = [], itemProducts = [] } = createOrderDto.shopOrders[i];
      const checkProduct = await this.cartRepository.checkProductInCart(createOrderDto.cartId, itemProducts);
      if (!checkProduct[0]) {
        throw new CustomException(ErrorCode.NOT_FOUND);
      }

      const checkoutPrice = checkProduct.reduce((acc, product) => {
        return acc + (product.quantity * product.price);
      }, 0)

      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shopDiscount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProduct,
      }

      if (shopDiscount.length > 0) {
        const { totalPrice, amount } = await this.discountService.getDiscountAmount({
          code: shopDiscount[0].code,
          userId: foundCart.userId,
          products: checkProduct
        }, shopId);

        checkoutOrder.totalDiscount += amount;

        if (totalPrice > 0) {

          itemCheckout.priceApplyDiscount = checkoutPrice - amount;
        }

        checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
        shopOrderNew.push(itemCheckout);
      }

    }
    return {
      shopOrders: createOrderDto.shopOrders,
      shopOrderNew,
      checkoutOrder
    }
  }

  async orderByUser(createOrderDto: CreateNewOrderDto) {
    {
      const { shopOrders, shopOrderNew, checkoutOrder } = await this.checkoutReview(createOrderDto.createOrderDto);

      const products = shopOrderNew.flatMap((shopOrder) => shopOrder.itemProducts);

      const accquireProduct = []
      for (let i = 0; i < products.length; i++) {
        const { productId, quantity } = products[i];
        const keyLock = await this.redisService.accquireLock(productId, quantity, createOrderDto.createOrderDto.cartId);
        accquireProduct.push(keyLock ? true : false);
        if (keyLock) {
          await this.redisService.releaseLock(productId, createOrderDto.createOrderDto.cartId);
        }
      }

      if (accquireProduct.includes(false)) {
        throw new CustomException(ErrorCode.SOME_PRODUCTS_HAVE_BEEN_UPDATED);
      }

      const newOrder = await this.orderModel.create({
        userId: createOrderDto.createOrderDto.userId,
        checkout: checkoutOrder,
        orderShipping: createOrderDto.userAddress,
        paymentMethod: createOrderDto.userPayment,
        products: shopOrderNew,
      })

      if (newOrder) {
        await this.redisService.releaseLock(createOrderDto.createOrderDto.cartId, createOrderDto.createOrderDto.cartId);
        const checkDiscount = await this.discountRepository.updateManyDiscount(shopOrders.map((shopOrder) => shopOrder.shopDiscount[0].code), createOrderDto.createOrderDto.userId);
       if(!checkDiscount){
         throw new CustomException(ErrorCode.SOME_DISCOUNTS_HAVE_BEEN_UPDATED);
       }
       await this.cartRepository.deleteItemInCart(createOrderDto.createOrderDto.cartId, products.map((product) => product.productId));
      }
      return newOrder;
    }
  }

  async getOrdersByUser(userId: string) {

  }

  async getOneOrderByUser(userId: string) {

  }

  async cancelOrderByUser(userId: string) {

  }

  async updateOrderStatusByShop(userId: string) {

  }
}
