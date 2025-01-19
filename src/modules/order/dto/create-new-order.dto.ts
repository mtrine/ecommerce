import { IsNotEmpty, IsString } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

export class CreateNewOrderDto {
    @IsNotEmpty()
    createOrderDto: CreateOrderDto;

    @IsNotEmpty()
    userAddress: any;

    @IsNotEmpty()
    userPayment: any 
}