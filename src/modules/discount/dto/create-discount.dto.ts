import { IsString, IsNumber, IsDate, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateDiscountDto {
        @IsString()
        name: string;

        @IsString()
        description: string;

        @IsString()
        type: string;

        @IsNumber()
        value: number;

        @IsString()
        code: string;

        @IsString()
        startDate: string;
        
        @IsString()
        endDate: string;

        @IsNumber()
        maxUses: number;

        @IsNumber()
        usesCount: number;

        @IsArray()
        userUsed: Array<string>;

        @IsNumber()
        maxUsesPerUser: number;

        @IsNumber()
        minOrderValue: number;

        @IsBoolean()
        isActive: boolean;

        @IsString()
        appliesTo: string;

        @IsArray()
        products: Array<string>;
}
