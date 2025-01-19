import { IsArray, IsNotEmpty } from "class-validator";
import { ItemProductDto } from "src/modules/cart/dto/update-cart.dto";

export class ShopDiscountDto {
    @IsNotEmpty()
    shopId: string;

    @IsNotEmpty()
    discountId: string;

    @IsNotEmpty()
    code: string;
}

export class ShopOrderDto {
    @IsNotEmpty()
    shopId: string;

    @IsArray()
    shopDiscount: ShopDiscountDto[];

    @IsArray()
    itemProducts: ItemProductDto[];
}

export class CreateOrderDto {
    @IsNotEmpty()
    cartId: string;

    @IsNotEmpty()
    userId: string;

    @IsArray()
    shopOrders: ShopOrderDto[];
}
