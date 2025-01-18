import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
export class ItemProductDto {
    @IsNotEmpty()
    shopId: string;

    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    oldQuantity: number;
}

export class UpdateCartDto {
    @IsString()
    userId: string;

    @IsArray()
    itemProducts: ItemProductDto[];
}

