import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateShopDto {

        @IsString()
        @IsNotEmpty()
        name: string;
    
        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @IsString()
        @IsNotEmpty()
        password: string;      
        
        @IsString()
        @IsNotEmpty()
        address: string;
}
