import { IsArray, IsString } from "class-validator";

export class GetDiscountDto {

    @IsString()
    code: string;

    @IsString()
    userId: string;

    @IsArray()
    products: any[];
}