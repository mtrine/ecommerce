import { IsNotEmpty, IsString } from "class-validator";

export class CreateInventoryDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    location: string = "unknown";

    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    shopId: string;
}
