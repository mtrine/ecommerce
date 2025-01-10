import { IsNotEmpty, IsString } from "class-validator";
import { ProductType } from "src/enums/product-type.enum";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    thumb: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    type: ProductType;

    shop: string;

    @IsNotEmpty()
    attributes: any;
}
