import {  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart } from "./schema/cart.schema";
import { Model } from "mongoose";
import { CartState } from "src/enums/cart-state.enum";

@Injectable()
export class CartRepository{
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<Cart>
    ){}
    
    async findById(id: string){
        return await this.cartModel.findOne({
            _id: id,
            state:CartState.ACTIVE
        }).lean();
    }

    async checkProductInCart(cartId: string, products: Array<any>) {
        // Tìm giỏ hàng theo ID
        const cart = await this.cartModel.findById(cartId).lean();
      
        if (!cart) {
          throw new Error('Cart not found');
        }
      
        // Lấy danh sách productId từ các sản phẩm trong cart
        const productIdsInCart = cart.products.map((product) => product.productId);
      
        // Tạo danh sách các sản phẩm có trong cart
        const productsInCart = products.filter((product) =>
          productIdsInCart.includes(product.productId)
        );
      
        return productsInCart;
      }
      
    async deleteItemInCart(cartId: string, productIds: Array<string>) {
        return await this.cartModel.findOneAndUpdate(
            { _id: cartId, state: CartState.ACTIVE },
            {
              $pull: {
                products: {
                  productId: { $in: productIds },
                },
              },
            },
            { new: true }
          );
    }
}