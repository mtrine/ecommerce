import { IsNotEmpty, IsString } from "class-validator";

export class ProductDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    shopId: string;

    @IsNotEmpty()
    quantity: number;
}

export class AddToCartDto {
    @IsString()
    userId: string;

    @IsNotEmpty()
    product: ProductDto;
}
