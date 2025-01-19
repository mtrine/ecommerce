import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateNewOrderDto } from './dto/create-new-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }


  @Post("review")
  checkoutReview(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.checkoutReview(createOrderDto);
  }

  @Post()
  create(@Body() createOrderDto: CreateNewOrderDto) {
    return this.orderService.orderByUser(createOrderDto);
  }
}
